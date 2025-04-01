import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './repositories/inventory.repository';

@Module({
  providers: [InventoryService , InventoryRepository],
  controllers: [InventoryController]
})
export class InventoryModule {}
