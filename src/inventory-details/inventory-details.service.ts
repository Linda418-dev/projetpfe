import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { InventoryDetailsRepository } from './repositories/inventory-details.repository';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { InventoryDetails } from './entities/inventory-details.entity';
import { AnomalyRepository } from 'src/anomaly/Repositories/anomaly.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';


@Injectable()
export class InventoryDetailsService {
  constructor(
    private readonly affectationRepository : AffectationRepository,
    private readonly fileRepository : FileRepository,
    private readonly inventoryDetailsRepository : InventoryDetailsRepository,
    private readonly assetStatusRepository : AssetStatusRepository,
    private readonly locationHistoryRepository : LocationHistoryRepository,
    private readonly assetRepository : AssetRepository,

  ) {}
  async getAllInventoryDetails() {
    const details = await this.inventoryDetailsRepository.find({
      relations: ['affectation', 'assetStatus', 'assetStatus.asset', 'locationHistory', 'files'],
      order: { scannedAt: 'DESC' },
    });
  
    return details.map((detail) => ({
      ...detail,
      assetId: detail.assetStatus?.asset?.id || null,
    }));
  }
  
  
  async createInventorydetails(dto: CreateInventoryDetailsDto) {
    // Vérifier si l'affectation existe
    const affectation = await this.affectationRepository.findOne({
      where: { id: dto.affectationId },
    });
    if (!affectation) {
      throw new NotFoundException('Affectation not found.');
    }
  
    // Vérifier que l'Asset existe
    const asset = await this.assetRepository.findOne({
      where: { id: dto.assetId },
    });
    if (!asset) {
      throw new NotFoundException('Asset not found.');
    }
  
    // Récupérer les fichiers si fournis
    const files = dto.fileIds?.length
      ? await this.fileRepository.findByIds(dto.fileIds)
      : [];
  
    // Associer l’asset  à chaque fichier
    for (const file of files) {
      file.asset = asset;
    }
    await this.fileRepository.save(files);
  
    // Récupérer le dernier AssetStatus 
    const assetStatus = await this.assetStatusRepository.findOne({
      where: { asset: { id: dto.assetId } },
      order: { createdAt: 'DESC' },
    });
    if (!assetStatus) {
      throw new NotFoundException('No AssetStatus found for this asset.');
    }
  
    // Récupérer la dernière LocationHistory
    const locationHistory = await this.locationHistoryRepository.findOne({
      where: { asset: { id: dto.assetId } },
      order: { createdAt: 'DESC' },
    });
    if (!locationHistory) {
      throw new NotFoundException('No LocationHistory found for this asset.');
    }
  
    // Créer le détail d’inventaire
    const inventoryDetail = this.inventoryDetailsRepository.create({
      affectation,
      assetStatus,
      locationHistory,
      files,
      scannedAt: new Date(),
      
    } as Partial<InventoryDetails>);
  
    // Sauvegarder le détail d’inventaire
    const savedInventoryDetail = await this.inventoryDetailsRepository.save(inventoryDetail);
  
    return savedInventoryDetail;
  }
  
  async getInventorydetailsById(id: string) {
    const detail = await this.inventoryDetailsRepository.findOne({
      where: { id },
      relations: ['affectation', 'assetStatus', 'assetStatus.asset', 'locationHistory', 'files'],
    });
  
    if (!detail) {
      throw new NotFoundException(`InventoryDetail with ID ${id} not found`);
    }
  
    return {
      ...detail,
      assetId: detail.assetStatus?.asset?.id,
    };
  }
  

  async getInventoryDetailsByInventoryId(inventoryId: string) {
    return this.inventoryDetailsRepository.findByInventoryId(inventoryId);
  }
}
