import { Injectable } from '@nestjs/common';
import { InventoryStatusRepository } from './repositories/inventory-status.repository';

@Injectable()
export class InventoryStatusService {
      constructor(private readonly inventoryStatusRepository : InventoryStatusRepository){}
      findAll() {
        return this.inventoryStatusRepository.find();
      }
    
      findByInventory(inventoryId: string) {
        return this.inventoryStatusRepository.find({
          where: { inventory: { id: inventoryId } },
          order: { createdAt: 'DESC' }, 
        });
      }
      
}
