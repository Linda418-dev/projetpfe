import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { AssetRepository } from './Repositories/Asset.repository';
import { CategoryService } from 'src/category/category.service';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { SupplierService } from 'src/supplier/supplier.service';
import { PlaceRepository } from 'src/places/Repositories/Place.repository';
import { PlacesService } from 'src/places/places.service';


@Module({
      controllers: [AssetController],
      providers: [AssetService , AssetRepository , CategoryService , CategoryRepository , SupplierRepository, SupplierService,PlaceRepository, PlacesService]
})

export class AssetModule {}
