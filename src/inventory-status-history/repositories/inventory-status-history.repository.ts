import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryStatusHistory } from '../entities/inventory-status-history.entity';


@Injectable()
export class InventoryStatusHistoryRepository extends Repository<InventoryStatusHistory> {
  constructor(private readonly dataSource: DataSource) {
    super(InventoryStatusHistory, dataSource.createEntityManager());
  }
}