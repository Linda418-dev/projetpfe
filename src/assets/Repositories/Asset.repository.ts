import {  Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Asset } from '../Entities/asset.entity';
import { PaginateSearchDto } from '../types/dto/paginate-search.dto';
import { AssetStatus } from 'src/asset-status/entities/asset-status.entity';


@Injectable()
export class AssetRepository extends Repository<Asset> {
  constructor(private readonly dataSource: DataSource) {
    super(Asset, dataSource.createEntityManager());
  }

 async getAllAssetWithPaginate(params: PaginateSearchDto) {
const query = this.createQueryBuilder("asset")
    .leftJoinAndSelect("asset.status", "status")
    .leftJoinAndSelect("asset.category", "category")
    .leftJoinAndSelect("asset.supplier", "supplier")
    .leftJoinAndSelect("asset.location", "location")
    .leftJoinAndSelect("asset.files", "files")

    // Jointures supplémentaires pour filtrer par site, department, service
    .leftJoin("location.service", "service")
    .leftJoin("service.department", "department")
    .leftJoin("department.site", "site");

    

  if (params.keyword) {
    query.andWhere("asset.name ILIKE :keyword", {
      keyword: `%${params.keyword}%`,
    });
  }

   if (params.categoryId) {
    query.andWhere("category.id = :categoryId", { categoryId: params.categoryId });
  }

   if (params.categoryId) {
    query.andWhere("supplier.id = :supplierId", { supplierId: params.supplierId });
  }

  
   if (params.locationId) {
    query.andWhere("location.id = :locationId", { locationId: params.locationId });
  }

   if (params.statusId) {
    query.andWhere("status.id = :statusId", { statusId: params.statusId });
  }

  // **Nouveaux filtres : site > department > service > location**

  if (params.siteId) {
    query.andWhere("site.id = :siteId", { siteId: params.siteId });
  } else if (params.departmentId) {
    query.andWhere("department.id = :departmentId", { departmentId: params.departmentId });
  } else if (params.serviceId) {
    query.andWhere("service.id = :serviceId", { serviceId: params.serviceId });
  }

  if (params.orderField && params.orderDirection) {
    query.orderBy(`asset.${params.orderField}`, params.orderDirection.toUpperCase() as 'ASC' | 'DESC');
  } else {
    query.orderBy("asset.createdAt", "DESC");
  }

  if (params.skip ) {
    query.skip(params.skip);
  }

  if (params.take ) {
    query.take(params.take);
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

   async findAllAssetsNotInRepair() {
    return this.createQueryBuilder('asset')
      .leftJoinAndSelect('asset.status', 'status')
      .leftJoinAndSelect('asset.category', 'category')
      .leftJoinAndSelect('asset.files', 'files')
      .leftJoinAndSelect('asset.supplier', 'supplier')
      .leftJoinAndSelect('asset.location', 'location')
      .where('status.name != :statusName', { statusName: 'In Repair' })
      .getMany();
  }

   async countAll() {
    return this.count();
  }

  async countByStatus() {
    const results = await this.createQueryBuilder('asset')
      .leftJoin('asset.status', 'status')
      .select('status.name', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('status.name')
      .getRawMany();

    const formatted = {};
    results.forEach(row => {
      formatted[row.status] = parseInt(row.count);
    });

    return formatted;
  }

  async countByCategory() {
    const results = await this.createQueryBuilder('asset')
      .leftJoin('asset.category', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('category.name')
      .getRawMany();

    const formatted = {};
    results.forEach(row => {
      formatted[row.category] = parseInt(row.count);
    });

    return formatted;
  }


async countAssetsNotInRepairBySite(siteId: string): Promise<number> {
  const subQuery = this.createQueryBuilder('a')
    .select('ast.status')
    .from(AssetStatus, 'ast')
    .where('ast.asset = a.id')
    .orderBy('ast.createdAt', 'DESC')
    .limit(1);

  const count = await this.createQueryBuilder('a')
    .innerJoin('a.location', 'location')
    .innerJoin('location.service', 'service')
    .innerJoin('service.department', 'department')
    .innerJoin('department.site', 'site')
    .where('site.id = :siteId', { siteId })
    .andWhere(qb => {
      const sub = qb.subQuery()
        .select('status.name')
        .from(AssetStatus, 'ast')
        .innerJoin('ast.status', 'status')
        .where('ast.asset = a.id')
        .orderBy('ast.createdAt', 'DESC')
        .limit(1)
        .getQuery();
      return `${sub} != :inRepair`;
    })
    .setParameter('inRepair', 'In Repair')
    .getCount();

  return count;
}








  
 
}