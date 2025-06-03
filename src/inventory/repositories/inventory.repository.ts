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
    .leftJoinAndSelect('inventory.locations', 'location') 
    .leftJoinAndSelect('location.service', 'service')
    .leftJoinAndSelect('service.department', 'department')
    .leftJoinAndSelect('department.site', 'locationSite')
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
    .leftJoinAndSelect('inventory.locations', 'location') // 🟢 d'abord joindre les locations
    .leftJoinAndSelect('location.service', 'service')     // 🟢 ensuite le service de chaque location
    .leftJoinAndSelect('service.department', 'department')
    .leftJoinAndSelect('department.site', 'locationSite') // site via department
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
  
   // méthode pour vérifier les chevauchements d'inventaire
   async findOverlappingInventory(siteId: string, startDate: Date, endDate: Date) {
    return this.createQueryBuilder('inventory')
      .where('inventory.siteId = :siteId', { siteId })
      .andWhere('inventory.startDate <= :endDate AND inventory.endDate >= :startDate', {
        startDate,
        endDate,
      })
      .getOne();
  }

  async findOverlappingInventoryexcludeId(siteId: string, startDate: Date, endDate: Date, excludeId: string) {
    return this.createQueryBuilder('inventory')
      .where('inventory.siteId = :siteId', { siteId })
      .andWhere('inventory.id != :excludeId', { excludeId })
      .andWhere(
        ':startDate <= inventory.endDate AND :endDate >= inventory.startDate',
        { startDate, endDate },
      )
      .getOne();
  }
  
 
  
 
}