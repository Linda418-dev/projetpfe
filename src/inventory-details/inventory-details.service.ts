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
import { UpdateInventoryDetailsDto } from './types/dto/update-Inventory-details.dto';
import { File } from 'src/uploads/entities/file.entity';


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
  // get All Inventory  Details
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



  // creat Inventory Details
  async createInventorydetails(dto: CreateInventoryDetailsDto) {
  // Vérifier l'affectation existe
  const affectation = await this.affectationRepository.findOne({
  where: { id: dto.affectationId },
  relations: ['operator', 'operator.role', 'inventory', 'inventory.site'],
  });
  if (!affectation) {
    throw new NotFoundException('Affectation not found.');
  }
  
  // Vérifier Asset existe
    const asset = await this.assetRepository.findOne({
      where: { id: dto.assetId },
    });
    if (!asset) {
      throw new NotFoundException( 'Asset not found ');
    }
  
    // les fichiers 
    const files = dto.fileIds?.length
      ? await this.fileRepository.findByIds(dto.fileIds)
      : [];
    for (const file of files) {
      file.asset = asset;
    }
    await this.fileRepository.save(files);
  
    // eécupérer le dernier AssetStatus 
    const assetStatus = await this.assetStatusRepository.findOne({
      where: { asset: { id: dto.assetId } },
      order: { createdAt: 'DESC' },
    });
    if (!assetStatus) {
      throw new NotFoundException('No AssetStatus found for this asset.');
    }
  
    // récupérer la dernière LocationHistory
    const locationHistory = await this.locationHistoryRepository.findOne({
      where: { asset: { id: dto.assetId } },
      order: { createdAt: 'DESC' },
    });
    if (!locationHistory) {
      throw new NotFoundException('No LocationHistory found for this asset.');
    }
  
    // créer 
    const inventoryDetail = this.inventoryDetailsRepository.create({
      affectation,
      assetStatus,
      locationHistory,
      files,
      scannedAt: new Date(),
      
    } as Partial<InventoryDetails>);
  
    // sauvgarder 
     const savedInventoryDetail = await this.inventoryDetailsRepository.save(inventoryDetail);
     const operatorId = (affectation.operator as any)?.id;
     const inventoryId = (affectation.inventory as any)?.id;
     const siteId = (affectation.inventory as any)?.site?.id;
     const inventoryName = (affectation.inventory as any)?.name;
     if (operatorId && inventoryId && siteId && inventoryName) {
    await this.checkAndNotifyIfScanComplete(operatorId, inventoryId, siteId, inventoryName);
  } else {
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
    await this.notifyAdminsOfCompletedsacnned(inventoryName, siteId);
  }
  }
  
  async notifyAdminsOfCompletedsacnned(inventoryName: string, siteId: string) {
  // Trouver les admins associés au site concerné ET qui ont un playerId
  const admins = await this.userRepository.find({
    where: {
      role: { role: UserRoleEnum.ADMIN },
      playerId: Not(IsNull()),
      site: { id: siteId }, 
    },
    relations: ['role', 'site'],
  });

  const playerIds = admins
    .map(admin => admin.playerId)
    .filter(id => !!id);

  if (playerIds.length === 0) {
  console.warn(`No admins with playerId found for siteId: ${siteId}`);
  return;
}


  const title = 'Inventory Completed';
  const message = `The inventory "${inventoryName}" has been fully scanned`;

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


  async updateInventoryDetailsById(inventoryDetailsId: string, dto: UpdateInventoryDetailsDto) {
  //Vérifier  InventoryDetails existe
  const inventoryDetails = await this.inventoryDetailsRepository.findOne({
    where: { id: inventoryDetailsId },
    relations: ['assetStatus', 'locationHistory', 'files'],
  });

  if (!inventoryDetails) {
    throw new NotFoundException('InventoryDetails not found');
  }

  // Vérifier asset  existe
  const asset = await this.assetRepository.findOneBy({ id: dto.assetId });
  if (!asset) {
    throw new NotFoundException('Asset not found');
  }
if (dto.newStatusId) {
  const newStatus = this.assetStatusRepository.create({
    asset,
    status: { id: dto.newStatusId },
  });
  const savedStatus = await this.assetStatusRepository.save(newStatus);
  inventoryDetails.assetStatus = savedStatus;

  asset.status = savedStatus.status;
}

if (dto.newLocationId) {
  const newLocation = this.locationHistoryRepository.create({
    asset,
    location: { id: dto.newLocationId },
  });
  const savedLocation = await this.locationHistoryRepository.save(newLocation);
  inventoryDetails.locationHistory = savedLocation;

  asset.location = savedLocation.location;
}

await this.assetRepository.save(asset);
  inventoryDetails.scannedAt = new Date();
  const saved = await this.inventoryDetailsRepository.save(inventoryDetails);
 if (saved.files?.length) {
  for (const file of saved.files) {
    if (typeof file === 'object' && 'inventoryDetails' in file) {
      delete (file as any).inventoryDetails;
    }
  }
}

  return saved;
}


  
}
