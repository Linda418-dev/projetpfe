import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Anomaly } from '../Entities/anomaly.entity';


@Injectable()
export class AnomalyRepository extends Repository<Anomaly> {
  constructor(private readonly dataSource: DataSource) {
    super(Anomaly, dataSource.createEntityManager());
  }

}