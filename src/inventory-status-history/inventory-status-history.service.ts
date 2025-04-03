import { Injectable } from '@nestjs/common';
import { InventoryStatusHistoryRepository } from './repositories/inventory-status-history.repository';

@Injectable()
export class InventoryStatusHistoryService {
    constructor(private readonly inventoryStatusHistoryRepository : InventoryStatusHistoryRepository){}

    async getInventoryStatusHistory(inventoryId: string) {
        return await this.inventoryStatusHistoryRepository.find({
            where: { inventory: { id: inventoryId } },
            relations: ['status'],
    
        });
    }
    async getAllInventoryStatusHistories() {
        return await this.inventoryStatusHistoryRepository.find({
            relations: ['inventory', 'status'],
            
        });
    }
    
}
