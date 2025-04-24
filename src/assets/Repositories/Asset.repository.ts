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

  
  
}