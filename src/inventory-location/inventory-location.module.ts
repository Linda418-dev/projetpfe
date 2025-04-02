import { Module } from '@nestjs/common';
import { InventoryLocationService } from './inventory-location.service';
import { InventoryLocationController } from './inventory-location.controller';

@Module({
  providers: [InventoryLocationService],
  controllers: [InventoryLocationController]
})
export class InventoryLocationModule {}
