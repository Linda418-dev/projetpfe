import { Module } from '@nestjs/common';
import { InventoryStatusHistoryService } from './inventory-status-history.service';
import { InventoryStatusHistoryController } from './inventory-status-history.controller';

@Module({
  providers: [InventoryStatusHistoryService],
  controllers: [InventoryStatusHistoryController]
})
export class InventoryStatusHistoryModule {}
