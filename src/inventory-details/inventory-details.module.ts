import { Module } from '@nestjs/common';
import { InventoryDetailsController } from './inventory-details.controller';
import { InventoryDetailsService } from './inventory-details.service';

@Module({
  controllers: [InventoryDetailsController],
  providers: [InventoryDetailsService]
})
export class InventoryDetailsModule {}
