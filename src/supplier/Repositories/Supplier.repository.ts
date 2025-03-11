import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Supplier } from '../Entities/Supplier.entity';

@Injectable()
export class SupplierRepository extends Repository<Supplier> {
  constructor(private readonly dataSource: DataSource) {
    super(Supplier, dataSource.createEntityManager());
  }
}
