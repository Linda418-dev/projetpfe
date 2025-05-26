import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InventoryDetails } from '../entities/inventory-details.entity';

@Injectable()
export class InventoryDetailsRepository extends Repository<InventoryDetails> {
  constructor(private dataSource: DataSource) {
    super(InventoryDetails, dataSource.createEntityManager());
  }
  async findByInventoryId(inventoryId: string) {
    return this.createQueryBuilder('inventoryDetails')
      .leftJoinAndSelect('inventoryDetails.affectation', 'affectation')
      .leftJoinAndSelect('affectation.inventory', 'inventory')
      .leftJoinAndSelect('affectation.operator', 'operator')  
      .leftJoinAndSelect('inventoryDetails.assetStatus', 'assetStatus')
      .leftJoinAndSelect('assetStatus.asset', 'asset')
      .leftJoinAndSelect('assetStatus.status', 'status')  
      .leftJoinAndSelect('inventoryDetails.locationHistory', 'locationHistory')
      .leftJoinAndSelect('inventoryDetails.files', 'files')
      .where('inventory.id = :inventoryId', { inventoryId })
      .orderBy('inventoryDetails.scannedAt', 'DESC')
      .addOrderBy('assetStatus.createdAt', 'DESC')  
      .getMany();
  }
   async findDetailsByInventoryId(inventoryId: string){
    return this.createQueryBuilder('details')
      .leftJoinAndSelect('details.affectation', 'affectation')
      .leftJoinAndSelect('affectation.operator', 'operator')
      .leftJoinAndSelect('affectation.inventory', 'inventory')
      .leftJoinAndSelect('details.locationHistory', 'locationHistory')
      .leftJoinAndSelect('locationHistory.location', 'location')
      .leftJoinAndSelect('locationHistory.asset', 'asset')
      .leftJoinAndSelect('asset.status', 'assetStatusFromAsset')
      .leftJoinAndSelect('details.assetStatus', 'assetStatus')
      .leftJoinAndSelect('assetStatus.status', 'status')
      .where('inventory.id = :inventoryId', { inventoryId })
      .getMany();
  }

async countScannedAssetsBySite(operatorId: string, inventoryId: string, siteId: string) {
  return this.createQueryBuilder('details')
    .innerJoin('details.affectation', 'affectation')
    .innerJoin('affectation.inventory', 'inventory')
    .innerJoin('inventory.site', 'site')
    .where('affectation.operator = :operatorId', { operatorId })
    .andWhere('inventory.id = :inventoryId', { inventoryId })
    .andWhere('site.id = :siteId', { siteId }) // <== Fix ici
    .getCount();
}



  

  
  
  
}
