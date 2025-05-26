import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Affectation } from '../entities/affectation.entity';
import { Asset } from 'src/assets/Entities/asset.entity';


@Injectable()
export class AffectationRepository extends Repository<Affectation> {
  constructor(private readonly dataSource: DataSource) {
    super(Affectation, dataSource.createEntityManager());
  }

async countTotalAssetsBySite(operatorId: string, inventoryId: string, siteId: string): Promise<number> {
  const qb = this.dataSource
    .getRepository(Asset)
    .createQueryBuilder('asset')
    .innerJoin(
      subQuery => {
        return subQuery
          .select('DISTINCT ON (status.assetId) status.assetId', 'assetId')
          .addSelect('status.status', 'status')
          .addSelect('status.createdAt', 'createdAt')
          .from('asset_status', 'status')
          .orderBy('status.assetId', 'ASC')
          .addOrderBy('status.createdAt', 'DESC');
      },
      'latest_status',
      'latest_status.assetId = asset.id',
    )
    .innerJoin('asset.location', 'location')
    .innerJoin('location.service', 'service')
    .innerJoin('service.department', 'department')
    .innerJoin('department.site', 'site')
    .where('site.id = :siteId', { siteId })
    .andWhere('latest_status.status != :repairStatus', { repairStatus: 'repair' });

  return qb.getCount();
}



}