import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AnomalyStatus } from '../entities/anomaly-status.entity';

@Injectable()
export class AnomalyStatusRepository extends Repository<AnomalyStatus> {
  constructor(private readonly dataSource: DataSource) {
    super(AnomalyStatus, dataSource.createEntityManager());
  }
}