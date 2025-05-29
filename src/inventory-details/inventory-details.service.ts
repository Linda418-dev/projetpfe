import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { InventoryDetailsRepository } from './repositories/inventory-details.repository';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { InventoryDetails } from './entities/inventory-details.entity';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { IAsset } from 'src/assets/types/interface/Asset.interface';
import { NotificationService } from 'src/notification/notification.service';
import { UserRoleEnum } from 'src/user-role/types/enums/user-role.enum';
import { IsNull, Not } from 'typeorm';
import { userRepository } from 'src/user/repositories/user.repository';


@Injectable()
export class InventoryDetailsService {
  constructor(
    private readonly affectationRepository : AffectationRepository,
    private readonly fileRepository : FileRepository,
    private readonly inventoryDetailsRepository : InventoryDetailsRepository,
    private readonly assetStatusRepository : AssetStatusRepository,
    private readonly locationHistoryRepository : LocationHistoryRepository,
    private readonly assetRepository : AssetRepository,
    private readonly notificationService : NotificationService,
    private readonly userRepository : userRepository

  ) {}
  async getAllInventoryDetails() {
    const details = await this.inventoryDetailsRepository.find({
      relations: ['affectation', 'assetStatus', 'assetStatus.asset', 'locationHistory', 'files'],
      order: { scannedAt: 'DESC' },
    });
  
     return details.map((detail) => {
    const asset = detail.assetStatus as IAsset;

    return {
      ...detail,
      assetId: asset.id,
    };
  });
  }
  
  async createInventorydetails(dto: CreateInventoryDetailsDto) {
    // Vérifier si l'affectation existe
 const affectation = await this.affectationRepository.findOne({
  where: { id: dto.affectationId },
  relations: ['operator', 'operator.role', 'inventory', 'inventory.site'],
});
;

    if (!affectation) {
      throw new NotFoundException('Affectation not found.');
    }
  
    // Vérifier que l'Asset existe
    const asset = await this.assetRepository.findOne({
      where: { id: dto.assetId },
    });
    if (!asset) {
      throw new NotFoundException( 'Asset not found ');
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
      // Exemples : récupérer operatorId, inventoryId, siteId, inventoryName depuis affectation ou dto
     const operatorId = (affectation.operator as any)?.id;
     const inventoryId = (affectation.inventory as any)?.id;
     const siteId = (affectation.inventory as any)?.site?.id;
     const inventoryName = (affectation.inventory as any)?.name;
  // sinon à adapter

  if (operatorId && inventoryId && siteId && inventoryName) {
    await this.checkAndNotifyIfScanComplete(operatorId, inventoryId, siteId, inventoryName);
  } else {
    // Optionnel : log warning si info manquante
    console.warn('Missing information for checkAndNotifyIfScanComplete');
  }
  
    return savedInventoryDetail;
  }



async checkAndNotifyIfScanComplete(operatorId: string, inventoryId: string, siteId: string, inventoryName: string) {
  const totalAssets = await this.assetRepository.countAssetsNotInRepairBySite(siteId);
  console.log('Total assets NOT in repair:', totalAssets);

  const scannedAssets = await this.inventoryDetailsRepository.countScannedAssetsBySite(operatorId, inventoryId, siteId);
  console.log('Scanned assets:', scannedAssets);

  if (scannedAssets >= totalAssets) {
    await this.notifyAdminsOfCompletedsacnned(inventoryName);
  }
}




async notifyAdminsOfCompletedsacnned(inventoryName: string) {
  // Trouver tous les admins qui ont un playerId pour recevoir les notifications
  const admins = await this.userRepository.find({
    where: {
      role: { role: UserRoleEnum.ADMIN },  
      playerId: Not(IsNull()),              
    },
    relations: ['role'],
  });

  // Extraire les playerIds valides
  const playerIds = admins
    .map(admin => admin.playerId)
    .filter(id => !!id);

  if (playerIds.length === 0) return; 

  // Préparer le titre et message de la notification
  const title = 'Inventory Completed';
  const message = `The inventory "${inventoryName}" has been fully scanned`;

  // Appeler le service de notification pour envoyer aux admins
  await this.notificationService.notifyOperators(playerIds, title, message);
}


  
  async getInventorydetailsById(id: string) {
    const detail = await this.inventoryDetailsRepository.findOne({
      where: { id },
      relations: ['affectation', 'assetStatus', 'assetStatus.asset', 'locationHistory', 'files'],
    });
  
    if (!detail) {
      throw new NotFoundException(`InventoryDetail with ID ${id} not found`);
    }
  
   const asset = detail.assetStatus as IAsset;
    return {
      ...detail,
      assetId : asset.id,
    };
  }
  
  async getInventoryDetailsByInventoryId(inventoryId: string) {
    return this.inventoryDetailsRepository.findByInventoryId(inventoryId);
  }


  
}
