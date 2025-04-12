import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LocationHistory } from '../entities/location-history.entity';



@Injectable()
export class LocationHistoryRepository extends Repository<LocationHistory> {
  constructor(private readonly dataSource: DataSource) {
    super(LocationHistory, dataSource.createEntityManager());
  }
}
