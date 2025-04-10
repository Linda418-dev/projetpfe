import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Location } from '../entities/location.entity';



@Injectable()
export class LocationRepository extends Repository<Location> {
  constructor(private readonly dataSource: DataSource) {
    super(Location, dataSource.createEntityManager());
  }
}
