import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetRepository } from './Repositories/Asset.repository';
import { AssetsService } from './asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsModule } from 'src/uploads/uploads.module';
import { Asset } from './Entities/Asset.entity';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/Entities/category.entity';
import { Supplier } from 'src/supplier/Entities/Supplier.entity';
import { Place } from 'src/places/Entities/Place.entity';
import { HistoriqueLocationAsset } from 'src/historique-location-asset/entities/historique-location-asset.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, Category, Supplier, Place, HistoriqueLocationAsset]),  
    UploadsModule
  ],
  controllers: [AssetController],
  providers: [AssetsService, AssetRepository, FileRepository, CategoryRepository, CategoryService],
  exports: [AssetsService, AssetRepository], 
})
export class AssetModule {}

