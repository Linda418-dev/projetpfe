import { Module } from '@nestjs/common';
import { InventoryStatusHistoryService } from './inventory-status-history.service';
import { InventoryStatusHistoryController } from './inventory-status-history.controller';
import { InventoryStatusHistoryRepository } from './repositories/inventory-status-history.repository';

@Module({
  providers: [InventoryStatusHistoryService ,InventoryStatusHistoryRepository],
  controllers: [InventoryStatusHistoryController]
})
export class InventoryStatusHistoryModule {}
