import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { InventoryDetailsRepository } from './repositories/inventory-details.repository';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { InventoryDetails } from './entities/inventory-details.entity';
import { AnomalyRepository } from 'src/anomaly/Repositories/anomaly.repository';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { InventoryStatusEnum } from 'src/status/types/enums/inventory-status.enum';
import { InventoryStatusRepository } from 'src/inventory-status/repositories/inventory-status.repository';
@Injectable()
export class InventoryDetailsService {
  constructor(
    private readonly affectationRepository : AffectationRepository,
    private readonly fileRepository : FileRepository,
    private readonly inventoryDetailsRepository : InventoryDetailsRepository,
    private readonly assetStatusRepository : AssetStatusRepository,
    private readonly  locationHistoryRepository : LocationHistoryRepository,
    private readonly inventoryStatusRepository : InventoryStatusRepository,
    private readonly anomalyRepository : AnomalyRepository

  ) {}
  
  async createInventorydetails(dto: CreateInventoryDetailsDto) {
    const affectation = await this.affectationRepository.findOneOrFail({
      where: { id: dto.affectationId },
    });
  
    // Récupérer les fichiers s’ils existent
    const files = dto.fileIds?.length
      ? await this.fileRepository.findByIds(dto.fileIds)
      : [];
  
    // Injecter assetId dans les fichiers (modification directe des entités)
    for (const file of files) {
      file.assetId = dto.assetId;
    }
    await this.fileRepository.save(files);
  
    // Si assetStatusId n’est pas fourni récupérer le dernier AssetStatus de l’asset
    const assetStatus = dto.assetStatusId
      ? await this.assetStatusRepository.findOne({ where: { id: dto.assetStatusId } })
      : await this.assetStatusRepository.findOne({
          where: { asset: { id: dto.assetId } },
          order: { createdAt: 'DESC' },
        });
  
    // Si locationHistoryId n’est pas fourni récupérer la dernière LocationHistory de l’asset
    const locationHistory = dto.locationHistoryId
      ? await this.locationHistoryRepository.findOne({ where: { id: dto.locationHistoryId } })
      : await this.locationHistoryRepository.findOne({
          where: { asset: { id: dto.assetId } },
          order: { createdAt: 'DESC' },
        });
        const anomaly = dto.anomalyId
        ? await this.anomalyRepository.findOne({ where: { id: dto.anomalyId } })
        : null;
        
    const inventoryDetail = this.inventoryDetailsRepository.create({
      affectation,
      assetStatus,
      locationHistory,
      files,
      scannedAt: new Date(),
      anomaly,
    } as Partial<InventoryDetails>);
  
    const savedInventoryDetail = await this.inventoryDetailsRepository.save(inventoryDetail);
    return savedInventoryDetail;
  }
  
  
  async  getAllInventoryDetails() {
    return this.inventoryDetailsRepository.find({
      relations: ['affectation', 'assetStatus', 'locationHistory', 'files'],
      order: { scannedAt: 'DESC' },
    });
  }
  
  async  getInventorydetailsById(id: string) {
    const detail = await this.inventoryDetailsRepository.findOne({
      where: { id },
      relations: ['affectation', 'assetStatus', 'locationHistory', 'files'],
    });
  
    if (!detail) {
      throw new NotFoundException(`InventoryDetail with ID ${id} not found`);
    }
  
    return detail;
  }
  
  async exportInventoryToExcel(inventoryId: string, res: Response) {
     // On va chercher le dernier status de l'inventaire
     const lastInventoryStatus = await this.inventoryStatusRepository.findLastStatusByInventoryId(inventoryId);
     
     if (!lastInventoryStatus) {
      throw new NotFoundException('Aucun statut trouvé pour cet inventaire.');
    }
    if (lastInventoryStatus.status.name !== InventoryStatusEnum.COMPLETED) {
      throw new BadRequestException('Seuls les inventaires terminés peuvent être exportés.');
    }
    const inventoryDetails = await this.inventoryDetailsRepository.findDetailsByInventoryId(inventoryId);

    if (!inventoryDetails.length) {
      throw new NotFoundException('Aucun détail trouvé pour cet inventaire.');
    }
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Export');
  
    worksheet.columns = [
      { header: 'Asset ID', key: 'assetId', width: 30 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Location', key: 'location', width: 30 },
      { header: 'Date Scannée', key: 'scannedAt', width: 25 },
    ];
  
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  
    for (const detail of inventoryDetails) {
      const asset = detail.assetStatus?.asset ?? detail.locationHistory?.asset;
  
      const assetId = asset?.id || 'Inconnu';
      const status = asset?.status?.name || 'Inconnu';
      const location = asset?.location?.name || 'Inconnue';
      const scannedAt = detail.scannedAt ? detail.scannedAt.toLocaleString('fr-FR') : '';
  
      worksheet.addRow({
        assetId,
        status,
        location,
        scannedAt,
      });
    }
  
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=inventory-${inventoryId}.xlsx`,
    );
  
    await workbook.xlsx.write(res);
    res.end();
  }
  
  
}
