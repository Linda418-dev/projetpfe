import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AssetAssignment } from '../Entities/asset-assignment.entity';

@Injectable()
export class AssetAssignmentRepository extends Repository<AssetAssignment> {
  constructor(private readonly dataSource: DataSource) {
    super(AssetAssignment, dataSource.createEntityManager());
  }

 async getAssignmentHistoryByAssetId(assetId: string) {
  return this.dataSource
    .createQueryBuilder()
    .select([
      'aa.assignedAt AS date',
      `'employee' AS type`,
      `u.username AS value`, // <-- seulement le nom
    ])
    .from('asset_assignment', 'aa')
    .leftJoin('user', 'u', 'u.id = aa.employeeId')
    .where('aa.assetId = :assetId', { assetId })
    .orderBy('aa.assignedAt', 'ASC')
    .getRawMany();
}


  
}