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

@Module({
  providers: [InventoryService , InventoryRepository, InventoryGateway,StatusRepository,InventoryStatusRepository,userRepository,AffectationRepository,SiteRepository],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
