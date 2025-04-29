import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';


@Injectable()
export class InventoryRepository extends Repository<Inventory> {
  constructor(private readonly dataSource: DataSource) {
    super(Inventory, dataSource.createEntityManager());
  }
  async findAllWithLatestStatus() {
    return this.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.site', 'site')
      .leftJoinAndSelect('inventory.affectations', 'affectation')
      .leftJoinAndSelect('affectation.operator', 'operator')
      .leftJoinAndSelect(
        'inventory.inventoryStatus',
        'latestStatus',
        `latestStatus.id = (
          SELECT "statusSub"."id"
          FROM "inventory_status" "statusSub"
          WHERE "statusSub"."inventoryId" = "inventory"."id"
          ORDER BY "statusSub"."createdAt" DESC
          LIMIT 1
        )`
      )
      .leftJoinAndSelect('latestStatus.status', 'statusDetail')
      .getMany();
  }
  

  async findInventoriesByOperatorIdWithStatus(userId: string) {
    return this.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.affectations', 'affectation')
      .leftJoinAndSelect('affectation.operator', 'operator')
      .leftJoinAndSelect('inventory.site', 'site')
      .leftJoinAndSelect(
        'inventory.inventoryStatus',
        'latestStatus',
        `latestStatus.id = (
          SELECT "statusSub"."id"
          FROM "inventory_status" "statusSub"
          WHERE "statusSub"."inventoryId" = "inventory"."id"
          ORDER BY "statusSub"."createdAt" DESC
          LIMIT 1
        )`
      )
      .leftJoinAndSelect('latestStatus.status', 'statusDetail')
      .where('operator.id = :userId', { userId })
      .getMany();
  }
  
  
  async getInventoryById(id: string){
    return this.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.site', 'site')
      .leftJoinAndSelect('inventory.affectations', 'affectation')
      .leftJoinAndSelect('affectation.operator', 'operator')
      .leftJoinAndSelect(
        'inventory.inventoryStatus',
        'latestStatus',
        `latestStatus.id = (
          SELECT "statusSub"."id"
          FROM "inventory_status" "statusSub"
          WHERE "statusSub"."inventoryId" = "inventory"."id"
          ORDER BY "statusSub"."createdAt" DESC
          LIMIT 1
        )`
      )
      .leftJoinAndSelect('latestStatus.status', 'statusDetail')
      .where('inventory.id = :id', { id })
      .getOne();
  }

  async findActiveInventory() {
    return this.createQueryBuilder('inventory')
      .leftJoinAndSelect(
        'inventory.inventoryStatus',
        'latestStatus',
        `latestStatus.id = (
          SELECT "statusSub"."id"
          FROM "inventory_status" "statusSub"
          WHERE "statusSub"."inventoryId" = "inventory"."id"
          ORDER BY "statusSub"."createdAt" DESC
          LIMIT 1
        )`
      )
      .leftJoinAndSelect('latestStatus.status', 'statusDetail')
      .where('statusDetail.name = :statusName', { statusName: 'In Progress' })
      .getOne();
  }
  
  
 
}