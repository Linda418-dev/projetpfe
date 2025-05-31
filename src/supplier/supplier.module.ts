import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from './Repositories/Supplier.repository';
import { Supplier } from './Entities/Supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SupplierService , SupplierRepository,AssetRepository,SiteRepository],
  controllers: [SupplierController],
  exports:[SupplierRepository]
})
export class SupplierModule {}
