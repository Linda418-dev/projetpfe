import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetRepository } from './Repositories/Asset.repository';
import { AssetsService } from './asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsModule } from 'src/uploads/uploads.module';
import { Asset } from './Entities/asset.entity';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/Entities/category.entity';
import { Supplier } from 'src/supplier/Entities/Supplier.entity';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { JwtService } from '@nestjs/jwt';
import { LocationRepository } from 'src/location/repositories/location.repository';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, Category, Supplier]),  
    UploadsModule
  ],
  controllers: [AssetController],
  providers: [AssetsService, AssetRepository, FileRepository, CategoryRepository, CategoryService ,SupplierRepository, LocationRepository,LocationHistoryRepository
    ,AssetStatusRepository,StatusRepository,JwtService],
  exports: [AssetsService, AssetRepository], 
})
export class AssetModule {}

