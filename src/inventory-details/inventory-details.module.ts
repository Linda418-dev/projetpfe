import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryDetails } from './entities/inventory-details.entity';
import { InventoryDetailsController } from './inventory-details.controller';
import { InventoryDetailsService } from './inventory-details.service';
import { InventoryDetailsRepository } from './repositories/inventory-details.repository';

import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Asset } from 'src/assets/Entities/Asset.entity';
import { Place } from 'src/places/Entities/Place.entity';
import { InventoryRepository } from 'src/inventory/repositories/inventory.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { PlaceRepository } from 'src/places/Repositories/Place.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryDetails, Inventory, Asset, Place])],
  controllers: [InventoryDetailsController],
  providers: [
    InventoryDetailsService,
    InventoryDetailsRepository,
    InventoryRepository,
    AssetRepository,
    PlaceRepository,
  ],
  exports: [InventoryDetailsRepository],
})
export class InventoryDetailsModule {}
