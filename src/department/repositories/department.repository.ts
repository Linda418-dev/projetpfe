import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Department } from '../entities/department.entity';

@Injectable()
export class DepartmentRepository extends Repository<Department> {
  constructor(private readonly dataSource: DataSource) {
    super(Department, dataSource.createEntityManager());
  }
}