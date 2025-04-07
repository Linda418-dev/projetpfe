import { Module } from '@nestjs/common';
import { InventoryAssignmentService } from './inventory-assignment.service';
import { InventoryAssignmentController } from './inventory-assignment.controller';

@Module({
  providers: [InventoryAssignmentService],
  controllers: [InventoryAssignmentController]
})
export class InventoryAssignmentModule {}
