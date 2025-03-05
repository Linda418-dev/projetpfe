import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Asset } from '../Entities/Asset.entity';


@Injectable()
export class AssetRepository extends Repository<Asset> {
  constructor(private readonly dataSource: DataSource) {
    super(Asset, dataSource.createEntityManager());
  }
}