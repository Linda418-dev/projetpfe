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
        console.log(` Retrieving inventories for : ${user.role.role}`);

        if (user.role.role === 'admin') {
            //  admin récupère tous les inventaires
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
        return userInventories;
    }


    async createInventory(dto: CreateInventoryDto): Promise<Inventory> {
        // Vérification si un inventaire existe déjà avec ce nom
        const existingInventory = await this.inventoryRepository.findOne({ where: { name: dto.name } });
        if (existingInventory) {
          throw new BadRequestException('An inventory with this name already exists');
        }
      
        // Vérification si la place existe
        const place = await this.placeRepository.findOne({ where: { id: dto.placeId } });
        if (!place) {
          throw new NotFoundException('The specified place does not exist');
        }
      
        // Validation des utilisateurs dans operatorAssignments
        if (dto.operatorAssignments) {
          const userIds = dto.operatorAssignments.map(assign => assign.userId);
      
          // Recherche des utilisateurs dans la base de données
          const users = await this.userRepository.find({ where: { id: In(userIds) } });
      
          // Vérification que tous les utilisateurs existent
          const missingUserIds = userIds.filter(userId => !users.some(user => user.id === userId));
          if (missingUserIds.length > 0) {
            throw new NotFoundException(`The following users were not found: ${missingUserIds.join(', ')}`);
          }
      
          // Vérification des départements associés à la place
          const departments = await this.departmentRepository.find({
            where: { placeId: dto.placeId },
          });
      
          dto.operatorAssignments.forEach(assign => {
            // Si aucun département n'est spécifié pour l'opérateur, on l'affecte à tous les départements de la place
            if (assign.departmentIds.length === 0) {
              assign.departmentIds = departments.map(department => department.id);
            }
      
            // Vérification que tous les départements spécifiés sont bien associés à la place
            const invalidDepartments = assign.departmentIds.filter(departmentId => 
              !departments.some(department => department.id === departmentId)
            );
            if (invalidDepartments.length > 0) {
              throw new BadRequestException(`The following departments are not valid: ${invalidDepartments.join(', ')}`);
            }
          });
        }
      
        // Création de l'inventaire avec les affectations des opérateurs si opérateur est défini
        const operatorAssignments = dto.operatorAssignments?.map(assign => ({
          userId: assign.userId,
          departmentIds: assign.departmentIds,
        }));
      
        const inventory = this.inventoryRepository.create({
          ...dto,
          place,
          operatorAssignments,
        });
      
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
            where: { endDate: IsNull() },
        });
    }
}


   