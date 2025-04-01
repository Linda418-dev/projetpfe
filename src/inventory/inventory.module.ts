import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './repositories/inventory.repository';
import { InventoryGateway } from './inventory.gateway';

@Module({
  providers: [InventoryService , InventoryRepository, InventoryGateway],
  controllers: [InventoryController]
})
export class InventoryModule {}
