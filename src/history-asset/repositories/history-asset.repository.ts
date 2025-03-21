import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HistoryAsset } from '../entities/history-Asset.entity';



@Injectable()
export class HistoryAssetRepository extends Repository<HistoryAsset> {
  constructor(private readonly dataSource: DataSource) {
    super(HistoryAsset, dataSource.createEntityManager());
  }
}
