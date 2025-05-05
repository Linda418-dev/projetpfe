import { Brackets, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Asset } from '../Entities/Asset.entity';
import { PaginateSearchDto } from '../types/dto/paginate-search.dto';


@Injectable()
export class AssetRepository extends Repository<Asset> {
  constructor(private readonly dataSource: DataSource) {
    super(Asset, dataSource.createEntityManager());
  }

  async getAllAssetWithPaginate(params: PaginateSearchDto) {
    const query = this.createQueryBuilder("asset");

    if (params.keyword) {
      query.where("asset.name ILIKE :keyword", {
        keyword: `%${params.keyword}%`,
      });
    }
    if (params.skip) {
      query.skip(params.skip);
    }
  
    if (params.take) {
      query.take(params.take);
    }

    if (params.orderField && params.orderDirection) {
      query.orderBy(`asset.${params.orderField}`, params.orderDirection);
    }

    return query.getManyAndCount();
  }

  async getLocationHistoryByAssetId(assetId: string) {
    return this.dataSource
      .createQueryBuilder()
      .select([
        'lh.createdAt AS date',
        `'location' AS type`,
        'location.name AS value',
      ])
      .from('location_history', 'lh')
      .leftJoin('location', 'location', 'location.id = lh.locationId')
      .where('lh.assetId = :assetId', { assetId })
      .orderBy('lh.createdAt', 'ASC')
      .getRawMany();
  }
  
  async getStatusHistoryByAssetId(assetId: string) {
    return this.dataSource
      .createQueryBuilder()
      .select([
        'astatus.createdAt AS date',
        `'status' AS type`,
        'status.name AS value',
      ])
      .from('asset_status', 'astatus')
      .leftJoin('status', 'status', 'status.id = astatus.statusId')
      .where('astatus.assetId = :assetId', { assetId })
      .orderBy('astatus.createdAt', 'ASC')
      .getRawMany();
  }
  

  
  
}