import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';


@Injectable()
export class InventoryRepository extends Repository<Inventory> {
  constructor(private readonly dataSource: DataSource) {
    super(Inventory, dataSource.createEntityManager());
  }

  async findInventoriesByOperatorId(userId: string) {
    return this.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.affectations', 'affectation')
      .leftJoinAndSelect('inventory.site', 'site')
      .where('affectation.operator.id = :userId', { userId })
      .getMany();
  }

  async findAllWithRelations(){
    return this.find({
      relations: ['site', 'affectations'],
    });
  }
 
  

}