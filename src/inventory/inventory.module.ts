import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './repositories/inventory.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { InventoryStatusRepository } from 'src/inventory-status/repositories/inventory-status.repository';
import { userRepository } from 'src/user/repositories/user.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { NotificationRepository } from 'src/notification/repositories/notification.repository';
import { LocationRepository } from 'src/location/repositories/location.repository';

@Module({
  providers: [InventoryService , InventoryRepository, StatusRepository,InventoryStatusRepository,userRepository,AffectationRepository,SiteRepository,NotificationService,ConfigService,NotificationRepository,
    LocationRepository  ],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
