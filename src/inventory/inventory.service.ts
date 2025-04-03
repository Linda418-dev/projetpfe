import { Injectable } from '@nestjs/common';
import { InventoryRepository } from './repositories/inventory.repository';
import { Inventory } from './entities/inventory.entity';
import { IsNull } from 'typeorm';
import { InventoryGateway } from './inventory.gateway';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { StatusEnum } from 'src/status/types/enums/status.enum';
import { userRepository } from 'src/user/repositories/user.repository';
import { InventoryStatusHistory } from 'src/inventory-status-history/entities/inventory-status-history.entity';
import { Status } from 'src/status/entities/status.entity';
import { InventoryStatusHistoryRepository } from 'src/inventory-status-history/repositories/inventory-status-history.repository';

@Injectable()
export class InventoryService {
    constructor(
        private readonly inventoryRepository: InventoryRepository,
        private readonly statusRepository: StatusRepository,
        private readonly inventoryGateway: InventoryGateway,
        private readonly userRepository: userRepository,
        private readonly inventoryStatusHistoryRepository: InventoryStatusHistoryRepository
    ) {}

    async getInventories(user: any) {
        console.log(`🔍 Récupération des inventaires pour : ${user.role.role}`);

        if (user.role.role === 'admin') {
            //  L'admin récupère TOUS les inventaires
            const inventories = await this.inventoryRepository.find({
                relations: ['users', 'status'],
            });
            console.log("Inventaires récupérés (Admin) :", JSON.stringify(inventories, null, 2));
            return inventories;
        }

        //  Un opérateur récupère seulement SES inventaires
        const userInventories = await this.inventoryRepository.find({
            relations: ['users', 'status'],
            where: { users: { id: user.id } },
        });

        console.log("Inventaires récupérés (Opérateur) :", JSON.stringify(userInventories, null, 2));
        return userInventories;
    }

    async launchInventory(name: string, operatorIds?: string[]): Promise<Inventory> {
        const activeInventory = await this.inventoryRepository.findOne({
            where: { closingDate: IsNull() },
        });

        if (activeInventory) {
            throw new Error('Un inventaire est déjà en cours !');
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

        if (operatorIds && operatorIds.length > 0) {
            inventory.users = await this.userRepository.findByIds(operatorIds);
            console.log("Utilisateurs ajoutés à l'inventaire :", inventory.users);
        }

        const newInventory = await this.inventoryRepository.save(inventory);
        await this.saveStatusHistory(newInventory, statusInProgress);

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

        await this.saveStatusHistory(inventory, statusCompleted);

        return this.inventoryRepository.save(inventory);
    }

    async saveStatusHistory(inventory: Inventory, status: Status) {
        const statusHistory = new InventoryStatusHistory();
        statusHistory.inventory = inventory;
        statusHistory.status = status;        
        return await this.inventoryStatusHistoryRepository.save(statusHistory);
    }

    async getActiveInventory() {
        return this.inventoryRepository.findOne({
            where: { closingDate: IsNull() },
        });
    }
}
