import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './repositories/inventory.repository';
import { InventoryGateway } from './inventory.gateway';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { InventoryStatusRepository } from 'src/inventory-status/repositories/inventory-status.repository';
import { userRepository } from 'src/user/repositories/user.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [InventoryService , InventoryRepository, InventoryGateway,StatusRepository,InventoryStatusRepository,userRepository,AffectationRepository,SiteRepository,NotificationService,ConfigService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
