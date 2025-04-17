import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';


@Injectable()
export class InventoryRepository extends Repository<Inventory> {
  constructor(private readonly dataSource: DataSource) {
    super(Inventory, dataSource.createEntityManager());
  }
  // inventory.repository.ts
async findWithStatuses(statuses: string[]) {
  return this.createQueryBuilder('inventory')
    .innerJoinAndSelect('inventory.statuses', 'inventoryStatus')
    .innerJoinAndSelect('inventoryStatus.status', 'status')
    .where(qb => {
      const subQuery = qb.subQuery()
        .select('MAX(s2.createdAt)')
        .from('inventory_status', 's2')
        .where('s2.inventoryId = inventory.id')
        .getQuery();
      return `inventoryStatus.createdAt = ${subQuery}`;
    })
    .andWhere('status.name IN (:...statuses)', { statuses })
    .getMany();
}

}