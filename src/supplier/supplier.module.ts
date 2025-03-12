import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from './Repositories/Supplier.repository';

@Module({
  providers: [SupplierService , SupplierRepository],
  controllers: [SupplierController]
})
export class SupplierModule {}
