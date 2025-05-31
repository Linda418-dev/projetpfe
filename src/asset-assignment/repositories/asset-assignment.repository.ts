import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AssetAssignment } from '../Entities/asset-assignment.entity';

@Injectable()
export class AssetAssignmentRepository extends Repository<AssetAssignment> {
  constructor(private readonly dataSource: DataSource) {
    super(AssetAssignment, dataSource.createEntityManager());
  }
  
}