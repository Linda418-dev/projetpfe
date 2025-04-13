import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { StatusRepository } from './repositories/status.repository';
import { AssetStatusEnum } from './types/enums/asset-status.enum';
import { InventoryStatusEnum } from './types/enums/inventory-status.enum';

@Injectable()
export class StatusService implements OnApplicationBootstrap { 
    constructor(private readonly statusRepository: StatusRepository) {}

    async onApplicationBootstrap() {
        await this.seedAssetStatuses();
        await this.seedInventoryStatuses();
      }
    
      private async seedAssetStatuses() {
        for (const statusName of Object.values(AssetStatusEnum)) {
          const exists = await this.statusRepository.findOne({
            where: { name: statusName, type: 'asset' },
          });
          if (!exists) {
            await this.statusRepository.save({ name: statusName, type: 'asset' });
          }
        }
      }
    
      private async seedInventoryStatuses() {
        for (const statusName of Object.values(InventoryStatusEnum)) {
          const exists = await this.statusRepository.findOne({
            where: { name: statusName, type: 'inventory' },
          });
          if (!exists) {
            await this.statusRepository.save({ name: statusName, type: 'inventory' });
          }
        }
      }
}
