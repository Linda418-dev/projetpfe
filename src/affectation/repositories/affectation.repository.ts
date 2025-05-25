import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Affectation } from '../entities/affectation.entity';


@Injectable()
export class AffectationRepository extends Repository<Affectation> {
  constructor(private readonly dataSource: DataSource) {
    super(Affectation, dataSource.createEntityManager());
  }

async countTotalAssetsBySite(operatorId: string, inventoryId: string, siteId: string): Promise<number> {
  return this.createQueryBuilder('affectation')
    .innerJoin('affectation.operator', 'operator')
    .innerJoin('affectation.inventory', 'inventory')
    .innerJoin('inventory.site', 'site')
    .where('operator.id = :operatorId', { operatorId })
    .andWhere('inventory.id = :inventoryId', { inventoryId })
    .andWhere('site.id = :siteId', { siteId })
    .getCount();
}



}