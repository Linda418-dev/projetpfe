import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueLocationAssetService } from './historique-location-asset.service';
import { HistoriqueLocationAssetController } from './historique-location-asset.controller';
import { HistoriqueLocationAssetRepository } from './repositories/histprique-location-asset.repository';
import { AssetsService } from 'src/assets/asset.service';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { CategoryModule } from 'src/category/category.module';
import { SupplierModule } from 'src/supplier/supplier.module'; 
import { Category } from 'src/category/Entities/category.entity';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { HistoriqueLocationAsset } from './entities/historique-location-asset.entity';
import { PlaceRepository } from 'src/places/Repositories/Place.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoriqueLocationAsset, Category]), 
    SupplierModule,  
    CategoryModule,  
  ],
  providers: [
    HistoriqueLocationAssetService,
    HistoriqueLocationAssetRepository,
    AssetsService,
    AssetRepository,
    FileRepository,
    CategoryRepository,
    SupplierRepository,  
    PlaceRepository
  ],
  controllers: [HistoriqueLocationAssetController],
  exports: [HistoriqueLocationAssetService],
})
export class HistoriqueLocationAssetModule {}
