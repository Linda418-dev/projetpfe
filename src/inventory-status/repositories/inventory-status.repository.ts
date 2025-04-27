import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryStatus } from '../entities/inventory-status.entity';


@Injectable()
export class InventoryStatusRepository extends Repository<InventoryStatus> {
  constructor(private readonly dataSource: DataSource) {
    super(InventoryStatus, dataSource.createEntityManager());
  }
  async findLastStatusByInventoryId(inventoryId: string){
    return this.createQueryBuilder('inventoryStatus')
      .leftJoinAndSelect('inventoryStatus.status', 'status')
      .where('inventoryStatus.inventoryId = :inventoryId', { inventoryId })
      .orderBy('inventoryStatus.createdAt', 'DESC')
      .getOne();
  }
}