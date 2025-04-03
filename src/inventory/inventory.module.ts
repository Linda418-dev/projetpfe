import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './repositories/inventory.repository';
import { InventoryGateway } from './inventory.gateway';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { userRepository } from 'src/user/repositories/user.repository';

@Module({
  providers: [InventoryService , InventoryRepository, InventoryGateway,StatusRepository, userRepository],
  controllers: [InventoryController]
})
export class InventoryModule {}
