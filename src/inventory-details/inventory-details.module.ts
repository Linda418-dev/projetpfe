import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryDetails } from './entities/inventory-details.entity';
import { InventoryDetailsController } from './inventory-details.controller';
import { InventoryDetailsService } from './inventory-details.service';
import { InventoryDetailsRepository } from './repositories/inventory-details.repository';

import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Asset } from 'src/assets/Entities/Asset.entity';
import { InventoryRepository } from 'src/inventory/repositories/inventory.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryDetails, Inventory, Asset])],
  controllers: [InventoryDetailsController],
  providers: [
    InventoryDetailsService,
    InventoryDetailsRepository,
    InventoryRepository,
    AssetRepository,
   
  ],
  exports: [InventoryDetailsRepository],
})
export class InventoryDetailsModule {}
