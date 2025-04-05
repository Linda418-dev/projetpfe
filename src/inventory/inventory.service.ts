import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from './repositories/inventory.repository';
import { Inventory } from './entities/inventory.entity';
import { In, IsNull } from 'typeorm';
import { InventoryGateway } from './inventory.gateway';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { StatusEnum } from 'src/status/types/enums/status.enum';
import { userRepository } from 'src/user/repositories/user.repository';
import { InventoryStatusHistory } from 'src/inventory-status-history/entities/inventory-status-history.entity';
import { Status } from 'src/status/entities/status.entity';
import { InventoryStatusHistoryRepository } from 'src/inventory-status-history/repositories/inventory-status-history.repository';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { PlaceRepository } from 'src/places/Repositories/Place.repository';
import { User } from 'src/user/entities/user.entity';
import { DepartmentRepository } from 'src/department/repositories/department.repository';
import { UpdateInventoryDto } from './types/dto/update-inventory.dto';

@Injectable()
export class InventoryService {
    constructor(
        private readonly inventoryRepository: InventoryRepository,
        private readonly statusRepository: StatusRepository,
        private readonly inventoryGateway: InventoryGateway,
        private readonly userRepository: userRepository,
        private readonly inventoryStatusHistoryRepository: InventoryStatusHistoryRepository,
        private readonly placeRepository: PlaceRepository,
        private readonly departmentRepository : DepartmentRepository
    ) {}

    async getInventories(user: any) {
        console.log(`Retrieving inventories for : ${user.role.role}`);
    
        if (user.role.role === 'admin') {
            // admin récupère tous les inventaires
            const inventories = await this.inventoryRepository.find({
                relations: ['users', 'status'],
            });
            return inventories;
        }
    
        // opérateur récupère ses inventaires
        const userInventories = await this.inventoryRepository.find({
            relations: ['users', 'status'],
            where: { users: { id: user.id } },
        });
    
        console.log(`Operator inventories: `, userInventories); // Ajoute un log pour voir les résultats
        return userInventories;
    }
    


    async createInventory(dto: CreateInventoryDto): Promise<Inventory> {
        const existingInventory = await this.inventoryRepository.findOne({ where: { name: dto.name } });
        if (existingInventory) {
          throw new BadRequestException('An inventory with this name already exists');
        }
      
        const place = await this.placeRepository.findOne({ where: { id: dto.placeId } });
        if (!place) {
          throw new NotFoundException('The specified place does not exist');
        }
      
        const status = await this.statusRepository.findOne({ where: { name: StatusEnum.PENDING } });
        if (!status) {
          throw new NotFoundException('The status "Pending" does not exist');
        }
      
        if (dto.operatorAssignments) {
          const userIds = dto.operatorAssignments.map(assign => assign.userId);
          const users = await this.userRepository.find({ where: { id: In(userIds) } });
      
          const missingUserIds = userIds.filter(userId => !users.some(user => user.id === userId));
          if (missingUserIds.length > 0) {
            throw new NotFoundException(`The following users were not found: ${missingUserIds.join(', ')}`);
          }
      
          const departments = await this.departmentRepository.find({ where: { placeId: dto.placeId } });
      
          dto.operatorAssignments.forEach(assign => {
            if (assign.departmentIds.length === 0) {
              assign.departmentIds = departments.map(department => department.id);
            }
      
            const invalidDepartments = assign.departmentIds.filter(departmentId =>
              !departments.some(department => department.id === departmentId)
            );
            if (invalidDepartments.length > 0) {
              throw new BadRequestException(`The following departments are not valid: ${invalidDepartments.join(', ')}`);
            }
          });
        }
      
        const operatorAssignments = dto.operatorAssignments?.map(assign => ({
          userId: assign.userId,
          departmentIds: assign.departmentIds,
        }));
      
        // Création de l'inventaire
        const inventory = this.inventoryRepository.create({
          ...dto,
          place,
          status,
          operatorAssignments,
        });
      
        const savedInventory = await this.inventoryRepository.save(inventory);
      
        // Enregistrement de l'historique du statut
        const history = this.inventoryStatusHistoryRepository.create({
          inventory: savedInventory,
          status: status,
        });
      
        await this.inventoryStatusHistoryRepository.save(history);
      
        return savedInventory;
      }
      



      async launchInventory(inventoryId: string): Promise<Inventory> {
        // 1. Vérification de l'existence de l'inventaire
        const inventory = await this.inventoryRepository.findOne({
          where: { id: inventoryId },
          relations: ['status'],
        });
        if (!inventory) {
          throw new NotFoundException('Inventory not found');
        }
      
        // 2. Récupération du statut "In Progress"
        const inProgressStatus = await this.statusRepository.findOne({
          where: { name: StatusEnum.IN_PROGRESS },
        });
        if (!inProgressStatus) {
          throw new NotFoundException('Status "In Progress" does not exist');
        }
      
        // 3. Mise à jour du statut
        inventory.status = inProgressStatus;
        const updatedInventory = await this.inventoryRepository.save(inventory);
      
        // 4. Enregistrement dans l'historique
        const statusHistory = this.inventoryStatusHistoryRepository.create({
          inventory: updatedInventory,
          status: inProgressStatus,
        });
        await this.inventoryStatusHistoryRepository.save(statusHistory);
      
        return updatedInventory;
      }

      
      async updateInventory(id: string, dto: UpdateInventoryDto): Promise<Inventory> {
        const inventory = await this.inventoryRepository.findOne({
          where: { id },
          relations: ['place', 'status'],
        });
      
        if (!inventory) {
          throw new NotFoundException('Inventory not found');
        }
      
        // 🚫 Bloquer la modification si le statut est "COMPLETED"
        if (inventory.status.name === StatusEnum.COMPLETED) {
          throw new BadRequestException('Cannot modify a completed inventory');
        }
      
        // Vérifier unicité du nom
        if (dto.name) {
          const existing = await this.inventoryRepository.findOne({ where: { name: dto.name } });
          if (existing && existing.id !== id) {
            throw new BadRequestException('Another inventory with this name already exists');
          }
          inventory.name = dto.name;
        }
      
        // Mise à jour des dates
        if (dto.startDate) inventory.startDate = new Date(dto.startDate);
        if (dto.endDate) inventory.endDate = new Date(dto.endDate);
      
        // Mise à jour de la place
        if (dto.placeId) {
          const place = await this.placeRepository.findOne({ where: { id: dto.placeId } });
          if (!place) {
            throw new NotFoundException('Place not found');
          }
          inventory.place = place;
        }
      
        // Mise à jour des affectations opérateurs
        if (dto.operatorAssignments) {
          const userIds = dto.operatorAssignments.map(assign => assign.userId);
          const users = await this.userRepository.find({ where: { id: In(userIds) } });
          const missingUserIds = userIds.filter(id => !users.some(u => u.id === id));
          if (missingUserIds.length > 0) {
            throw new NotFoundException(`Users not found: ${missingUserIds.join(', ')}`);
          }
      
          const departments = await this.departmentRepository.find({ where: { placeId: inventory.place.id } });
      
          dto.operatorAssignments.forEach(assign => {
            if (assign.departmentIds.length === 0) {
              assign.departmentIds = departments.map(dep => dep.id);
            }
            const invalidDepartments = assign.departmentIds.filter(depId =>
              !departments.some(dep => dep.id === depId),
            );
            if (invalidDepartments.length > 0) {
              throw new BadRequestException(`Invalid departments: ${invalidDepartments.join(', ')}`);
            }
          });
      
          inventory.operatorAssignments = dto.operatorAssignments;
        }
      
        return await this.inventoryRepository.save(inventory);
      }
      
      
      async deleteInventory(id: string): Promise<{ message: string }> {
        const inventory = await this.inventoryRepository.findOne({
          where: { id },
          relations: ['status'],
        });
      
        if (!inventory) {
          throw new NotFoundException('Inventory not found');
        }
      
        if (
          inventory.status.name === StatusEnum.IN_PROGRESS ||
          inventory.status.name === StatusEnum.COMPLETED
        ) {
          throw new BadRequestException(
            'Cannot delete an inventory that is in progress or completed',
          );
        }
      
        await this.inventoryRepository.remove(inventory);
      
        return { message: 'Inventory deleted successfully' };
      }

      
    /*async saveStatusHistory(inventory: Inventory, status: Status) {
        const statusHistory = new InventoryStatusHistory();
        statusHistory.inventory = inventory;
        statusHistory.status = status;
        return await this.inventoryStatusHistoryRepository.save(statusHistory);
    }*/

    async getActiveInventory() {
        return this.inventoryRepository.findOne({
            where: { endDate: IsNull() },
        });
    }
}


   