import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AssetStatus } from '../entities/asset-status.entity';
import { AssetStatusEnum } from 'src/status/types/enums/asset-status.enum';

@Injectable()
export class AssetStatusRepository extends Repository<AssetStatus> {
  constructor(private readonly dataSource: DataSource) {
    super(AssetStatus, dataSource.createEntityManager());
  }


  async findLatestValidAssetStatus(assetId: string, excludeStatus: AssetStatusEnum) {
    return this.createQueryBuilder('assetStatus')
      .innerJoinAndSelect('assetStatus.status', 'status')
      .where('assetStatus.asset = :assetId', { assetId })
      .andWhere('status.name != :excludeStatus', { excludeStatus })
      .orderBy('assetStatus.createdAt', 'DESC')
      .getOne();
  }
   

  
}