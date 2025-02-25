import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Place } from '../Entities/Place.entity';


@Injectable()
export class PlaceRepository extends Repository<Place> {
  constructor(private readonly dataSource: DataSource) {
    super(Place, dataSource.createEntityManager());
  }
}
