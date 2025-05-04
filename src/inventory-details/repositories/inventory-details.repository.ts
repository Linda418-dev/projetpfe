import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InventoryDetails } from '../entities/inventory-details.entity';

@Injectable()
export class InventoryDetailsRepository extends Repository<InventoryDetails> {
  constructor(private dataSource: DataSource) {
    super(InventoryDetails, dataSource.createEntityManager());
  }

  async findByInventoryId(inventoryId: string){
    return this.createQueryBuilder('inventoryDetails')
      .leftJoinAndSelect('inventoryDetails.affectation', 'affectation')
      .leftJoinAndSelect('affectation.inventory', 'inventory')
      .leftJoinAndSelect('inventoryDetails.assetStatus', 'assetStatus')
      .leftJoinAndSelect('assetStatus.asset', 'asset')
      .leftJoinAndSelect('inventoryDetails.locationHistory', 'locationHistory')
      .leftJoinAndSelect('inventoryDetails.files', 'files')
      .leftJoinAndSelect('inventoryDetails.anomaly', 'anomaly')
      .where('inventory.id = :inventoryId', { inventoryId })
      .orderBy('inventoryDetails.scannedAt', 'DESC')
      .getMany();
  }
  
}
