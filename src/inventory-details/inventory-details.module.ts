import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryDetails } from './entities/inventory-details.entity';
import { InventoryDetailsController } from './inventory-details.controller';
import { InventoryDetailsService } from './inventory-details.service';
import { InventoryDetailsRepository } from './repositories/inventory-details.repository';

import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Asset } from 'src/assets/Entities/asset.entity';
import { InventoryRepository } from 'src/inventory/repositories/inventory.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { AnomalyRepository } from 'src/anomaly/Repositories/anomaly.repository';
import { InventoryStatusRepository } from 'src/inventory-status/repositories/inventory-status.repository';
import { NotificationService } from 'src/notification/notification.service';
import { userRepository } from 'src/user/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { NotificationRepository } from 'src/notification/repositories/notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryDetails, Inventory, Asset])],
  controllers: [InventoryDetailsController],
  providers: [
    InventoryDetailsService,
    InventoryDetailsRepository,
    InventoryRepository,
    AssetRepository,
    FileRepository,
    AffectationRepository,AssetStatusRepository,LocationHistoryRepository,AnomalyRepository,InventoryStatusRepository,
    NotificationService,userRepository,ConfigService,NotificationRepository
  ],
  exports: [InventoryDetailsRepository],
})
export class InventoryDetailsModule {}
