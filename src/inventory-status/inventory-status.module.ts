import { Module } from '@nestjs/common';
import { InventoryStatusService } from './inventory-status.service';
import { InventoryStatusController } from './inventory-status.controller';
import { InventoryStatusRepository } from './repositories/inventory-status.repository';

@Module({
  providers: [InventoryStatusService,InventoryStatusRepository],
  controllers: [InventoryStatusController]
})
export class InventoryStatusModule {}
