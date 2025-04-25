import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { InventoryDetailsRepository } from './repositories/inventory-details.repository';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { In } from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';
import { InventoryDetails } from './entities/inventory-details.entity';
import { AnomalyRepository } from 'src/anomaly/Repositories/anomaly.repository';

@Injectable()
export class InventoryDetailsService {
  constructor(
    private readonly affectationRepository : AffectationRepository,
    private readonly fileRepository : FileRepository,
    private readonly inventoryDetailsRepository : InventoryDetailsRepository,
    private readonly assetStatusRepository : AssetStatusRepository,
    private readonly  locationHistoryRepository : LocationHistoryRepository,
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
  
    const inventoryDetail = this.inventoryDetailsRepository.create({
      affectation,
      assetStatus,
      locationHistory,
      files,
      scannedAt: new Date(),
    } as Partial<InventoryDetails>);
  
    const savedInventoryDetail = await this.inventoryDetailsRepository.save(inventoryDetail);

    // Création des anomalies si elles existent
    if (dto.anomalies?.length) {
      const anomaliesToCreate = dto.anomalies.map(description => 
        this.anomalyRepository.create({
          description,
          inventoryDetail: savedInventoryDetail,
        })
      );
  
      // Sauvegarde des anomalies en une seule fois
      await this.anomalyRepository.save(anomaliesToCreate);
  
      savedInventoryDetail.anomalies = anomaliesToCreate;
    } else {
      savedInventoryDetail.anomalies = [];
    }
  
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
  
  
  
}
