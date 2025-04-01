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

    async launchInventory(): Promise<Inventory> {
        const statusInProgress = await this.statusRepository.findOne({ where: { name: StatusEnum.IN_PROGRESS } });
        if (!statusInProgress) {
            throw new Error('Status "In Progress" not found');
        }

        const inventory = new Inventory();
        inventory.launchDate = new Date();
        inventory.closingDate = null;
        inventory.status = statusInProgress; // ✅ Assignation du statut "In Progress"
        
        const newInventory = await this.inventoryRepository.save(inventory);
    
        this.inventoryGateway.notifyInventoryLaunch(); // 🔥 Notifier les opérateurs
    
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
        inventory.status = statusCompleted; // ✅ Assignation du statut "Completed"
        
        return this.inventoryRepository.save(inventory);
    }
}
