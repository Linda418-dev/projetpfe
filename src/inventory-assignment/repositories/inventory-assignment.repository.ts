import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryAssignment } from '../entities/InventoryAssignment.entity';


@Injectable()
export class InventoryAssignmentRepository extends Repository<InventoryAssignment> {
  constructor(private readonly dataSource: DataSource) {
    super(InventoryAssignment, dataSource.createEntityManager());
  }
}