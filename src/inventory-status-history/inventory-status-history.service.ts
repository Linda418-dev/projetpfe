import { Injectable } from '@nestjs/common';
import { InventoryStatusHistoryRepository } from './repositories/inventory-status-history.repository';

@Injectable()
export class InventoryStatusHistoryService {
    constructor(private readonly inventoryStatusHistoryRepository : InventoryStatusHistoryRepository){}
    // get les historiques du status d'un inventaires By Id
    async getInventoryStatusHistory(inventoryId: string) {
        return await this.inventoryStatusHistoryRepository.find({
            where: { inventory: { id: inventoryId } },
            relations: ['status'],
    
        });
    }
    // get all historiques pour tous les inventaires 
    async getAllInventoryStatusHistories() {
        return await this.inventoryStatusHistoryRepository.find({
            relations: ['inventory', 'status'],
            
        });
    }
    
}
