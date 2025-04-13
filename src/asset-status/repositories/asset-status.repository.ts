import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AssetStatus } from '../entities/asset-status.entity';

@Injectable()
export class AssetStatusRepository extends Repository<AssetStatus> {
  constructor(private readonly dataSource: DataSource) {
    super(AssetStatus, dataSource.createEntityManager());
  }
}