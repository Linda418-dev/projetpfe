import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { InventoryDetailsRepository } from './repositories/inventory-details.repository';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { InventoryDetails } from './entities/inventory-details.entity';
import { AnomalyRepository } from 'src/anomaly/Repositories/anomaly.repository';


@Injectable()
export class InventoryDetailsService {
  constructor(
    private readonly affectationRepository : AffectationRepository,
    private readonly fileRepository : FileRepository,
    private readonly inventoryDetailsRepository : InventoryDetailsRepository,
    private readonly assetStatusRepository : AssetStatusRepository,
    private readonly locationHistoryRepository : LocationHistoryRepository,
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
  
    
  // Récupérer le dernier AssetStatus
    const assetStatus = await this.assetStatusRepository.findOne({
    where: { asset: { id: dto.assetId } },
    order: { createdAt: 'DESC' },
    });

  // Récupérer la dernière LocationHistory
  const locationHistory = await this.locationHistoryRepository.findOne({
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
  
  
}
