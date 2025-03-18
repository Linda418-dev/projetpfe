import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HistoriqueLocationAsset } from '../entities/historique-location-asset.entity';


@Injectable()
export class HistoriqueLocationAssetRepository extends Repository<HistoriqueLocationAsset> {
  constructor(private readonly dataSource: DataSource) {
    super(HistoriqueLocationAsset, dataSource.createEntityManager());
  }
}