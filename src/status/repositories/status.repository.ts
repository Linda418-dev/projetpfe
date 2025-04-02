import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Status } from '../entities/status.entity';


@Injectable()
export class StatusRepository extends Repository<Status> {
  constructor(private readonly dataSource: DataSource) {
    super(Status, dataSource.createEntityManager());
  }
}