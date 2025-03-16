import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from './Repositories/Supplier.repository';
import { Supplier } from './Entities/Supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SupplierService , SupplierRepository],
  controllers: [SupplierController],
  exports:[SupplierRepository]
})
export class SupplierModule {}
