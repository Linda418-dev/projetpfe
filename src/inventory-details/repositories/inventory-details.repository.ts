import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InventoryDetails } from '../entities/inventory-details.entity';

@Injectable()
export class InventoryDetailsRepository extends Repository<InventoryDetails> {
  constructor(private dataSource: DataSource) {
    super(InventoryDetails, dataSource.createEntityManager());
  }
}
