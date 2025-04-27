import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InventoryDetails } from '../entities/inventory-details.entity';

@Injectable()
export class InventoryDetailsRepository extends Repository<InventoryDetails> {
  constructor(private dataSource: DataSource) {
    super(InventoryDetails, dataSource.createEntityManager());
  }

  async findDetailsByInventoryId(inventoryId: string) {
    return this.createQueryBuilder('inventoryDetail')
      .leftJoinAndSelect('inventoryDetail.affectation', 'affectation')
      .leftJoinAndSelect('affectation.inventory', 'inventory')
      .leftJoinAndSelect('inventoryDetail.assetStatus', 'assetStatus')
      .leftJoinAndSelect('assetStatus.asset', 'asset')
      .leftJoinAndSelect('asset.status', 'status')
      .leftJoinAndSelect('asset.location', 'location')
      .leftJoinAndSelect('inventoryDetail.locationHistory', 'locationHistory')
      .leftJoinAndSelect('locationHistory.asset', 'locationAsset')
      .leftJoinAndSelect('locationAsset.status', 'locationStatus')
      .where('affectation.inventory.id = :inventoryId', { inventoryId })
      .orderBy('inventoryDetail.scannedAt', 'DESC')
      .getMany();
  }
}
