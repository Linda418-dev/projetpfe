import { Injectable } from '@nestjs/common';
import { InventoryRepository } from './repositories/inventory.repository';
import { Inventory } from './entities/inventory.entity';
import { IsNull } from 'typeorm';
import { InventoryGateway } from './inventory.gateway';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { StatusEnum } from 'src/status/types/enums/status.enum';

@Injectable()
export class InventoryService {
    constructor(
        private readonly inventoryRepository: InventoryRepository,
        private readonly statusRepository: StatusRepository,
        private readonly inventoryGateway: InventoryGateway,
    ) {}

    async launchInventory(name: string): Promise<Inventory> {  
        const activeInventory = await this.inventoryRepository.findOne({
            where: { closingDate: IsNull() },
        });
    
        if (activeInventory) {
            throw new Error(' Un inventaire est déjà en cours !');
        }
        const statusInProgress = await this.statusRepository.findOne({ where: { name: StatusEnum.IN_PROGRESS } });
        if (!statusInProgress) {
            throw new Error('Status "In Progress" not found');
        }
        const inventory = new Inventory();
        inventory.name = name;  
        inventory.launchDate = new Date();
        inventory.closingDate = null;
        inventory.status = statusInProgress;
    
        const newInventory = await this.inventoryRepository.save(inventory);
    
        this.inventoryGateway.notifyInventoryLaunch(); 
    
        return newInventory;
    }
    
    

    async closeInventory() {
        const inventory = await this.inventoryRepository.findOne({
            where: { closingDate: IsNull() },
        });

        if (!inventory) {
            throw new Error('No active inventory found to close');
        }

        const statusCompleted = await this.statusRepository.findOne({ where: { name: StatusEnum.COMPLETED } });
        if (!statusCompleted) {
            throw new Error('Status "Completed" not found');
        }

        inventory.closingDate = new Date();
        inventory.status = statusCompleted;
        
        return this.inventoryRepository.save(inventory);
    }


    async getActiveInventory() {
        return this.inventoryRepository.findOne({
            where: { closingDate: IsNull() },
        });
    }
    
}
