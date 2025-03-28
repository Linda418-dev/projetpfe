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

  async getAllAssetWithPaginate(params:PaginateSearchDto){

  const  query=this.createQueryBuilder('asset');

  if (params.keyword) {
    query.where(
      //Brackets regrouper les conditions 
      new Brackets((qb) => {
        qb.where('asset.name ILIKE :keyword', { keyword: `%${params.keyword}%` })
          .orWhere('asset.supplierName ILIKE :keyword', { keyword: `%${params.keyword}%` })
          .orWhere('asset.categoryName ILIKE :keyword', { keyword: `%${params.keyword}%` });
      })
    );
  }
query.take(params.take).skip(params.skip);

//executer requete
const [data,total]=await query.getManyAndCount();
return {data,total}; 
  }
}