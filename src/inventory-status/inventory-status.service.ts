import { Injectable } from '@nestjs/common';
import { InventoryStatusRepository } from './repositories/inventory-status.repository';

@Injectable()
export class InventoryStatusService {
      constructor(private readonly inventoryStatusRepository : InventoryStatusRepository){}
        // get les historiques du status d'un inventaires By Id
        /*async getInventoryStatusHistory(inventoryId: string) {
            return await this.inventoryStatusRepository.find({
                where: { inventory: { id: inventoryId } },
                relations: ['status'],
        
            });
        }*/
        // get all historiques pour tous les inventaires 
        async getAllInventoryStatusHistories() {
            return await this.inventoryStatusRepository.find({
                relations: ['inventory', 'status'],
                
            });
        }
}
