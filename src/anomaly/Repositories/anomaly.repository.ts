import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Anomaly } from '../Entities/anomaly.entity';

@Injectable()
export class AnomalyRepository extends Repository<Anomaly> {
  constructor(private readonly dataSource: DataSource) {
    super(Anomaly, dataSource.createEntityManager());
  }

  async getAnomaliesByMonthRaw(){
  return this.createQueryBuilder('anomaly')
    .select("TO_CHAR(anomaly.createdAt, 'YYYY-MM')", 'month')
    .addSelect('COUNT(*)', 'count')
    .groupBy('month')
    .orderBy('month', 'ASC')
    .getRawMany();
}


 async findBySiteId(siteId: string): Promise<Anomaly[]> {
    return this.createQueryBuilder('anomaly')
      .leftJoinAndSelect('anomaly.reportedBy', 'user')
      .leftJoinAndSelect('anomaly.asset', 'asset')
      .leftJoinAndSelect('user.site', 'site')
      .leftJoinAndSelect('anomaly.statusHistory', 'statusHistory')
      .leftJoinAndSelect('anomaly.files', 'files')
      .where('site.id = :siteId', { siteId })
      .getMany();
  }

}