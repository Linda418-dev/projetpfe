import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HistoryStatusAsset } from '../entities/history-status-Asset.entity';

@Injectable()
export class HistoryStatusAssetRepository extends Repository<HistoryStatusAsset> {
  constructor(private readonly dataSource: DataSource) {
    super(HistoryStatusAsset, dataSource.createEntityManager());
  }
}
