import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from './repositories/inventory.repository';
import { Inventory } from './entities/inventory.entity';
import { In, IsNull, LessThanOrEqual } from 'typeorm';
import { InventoryGateway } from './inventory.gateway';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { StatusEnum } from 'src/status/types/enums/status.enum';
import { userRepository } from 'src/user/repositories/user.repository';
import { InventoryStatusHistoryRepository } from 'src/inventory-status-history/repositories/inventory-status-history.repository';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { PlaceRepository } from 'src/places/Repositories/Place.repository';
import { DepartmentRepository } from 'src/department/repositories/department.repository';
import { UpdateInventoryDto } from './types/dto/update-inventory.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

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

    async getAllInventories(user: any) {
      console.log(`Retrieving inventories for : ${user.role.role}`);
    
      if (user.role.role === 'admin') {
        // Admin récupère tous les inventaires
        const inventories = await this.inventoryRepository.find({
          relations: ['users', 'status'],
        });
        return inventories;
      }
    
      // Opérateur : récupérer les inventaires dans lesquels il est assigné via operatorAssignments
      const allInventories = await this.inventoryRepository.find({
        relations: ['status'],
      });
    
      // Filtrer les inventaires où l'utilisateur est dans operatorAssignments
      const assignedInventories = allInventories.filter(inventory =>
        inventory.operatorAssignments?.some(assign => assign.userId === user.id)
      );
    
      console.log(`Operator inventories: `, assignedInventories);
      return assignedInventories;
    }
    
    //méthode pour creer un inventaire 
    async createInventory(dto: CreateInventoryDto) {
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
      
    // méthode pour lancer inventaire 
      async launchInventory(inventoryId: string) {
        // verifier  l'inventaire par id  existe ou non 
        const inventory = await this.inventoryRepository.findOne({
          where: { id: inventoryId },
          relations: ['status'],
        });
        if (!inventory) {
          throw new NotFoundException('Inventory not found');
        }
      
        //  récupération statut "In Progress"
        const inProgressStatus = await this.statusRepository.findOne({
          where: { name: StatusEnum.IN_PROGRESS },
        });
        if (!inProgressStatus) {
          throw new NotFoundException('Status "In Progress" does not exist');
        }
      
        // modifier du statut
        inventory.status = inProgressStatus;
        const updatedInventory = await this.inventoryRepository.save(inventory);
      
        //  enregistrer dans l'historique
        const statusHistory = this.inventoryStatusHistoryRepository.create({
          inventory: updatedInventory,
          status: inProgressStatus,
        });
        await this.inventoryStatusHistoryRepository.save(statusHistory);
        this.inventoryGateway.notifyInventoryLaunch();
        return updatedInventory;
      }

      // méthode pour mettre à jour un inventaire 
      async updateInventory(id: string, dto: UpdateInventoryDto) {
        // Récupérer l'inventaire
        const inventory = await this.inventoryRepository.findOne({
            where: { id },
            relations: ['place', 'status'],
        });
    
        // Vérifier si l'inventaire existe
        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }
    
        // Ne pas modifier si le statut est "COMPLETED"
        if (inventory.status.name === StatusEnum.COMPLETED) {
            throw new BadRequestException('Cannot modify a completed inventory');
        }
    
        // Vérifier si le nom est modifié et s'assurer qu'il est unique
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
            // Sauvegarder les anciennes affectations
            inventory.previousAssignments = inventory.operatorAssignments;
    
            // Vérifier que les utilisateurs existent
            const userIds = dto.operatorAssignments.map(assign => assign.userId);
            const users = await this.userRepository.find({ where: { id: In(userIds) } });
            const missingUserIds = userIds.filter(id => !users.some(u => u.id === id));
            if (missingUserIds.length > 0) {
                throw new NotFoundException(`Users not found: ${missingUserIds.join(', ')}`);
            }
    
            // Vérifier les départements valides
            const departments = await this.departmentRepository.find({ where: { placeId: inventory.place.id } });
    
            dto.operatorAssignments.forEach(assign => {
                // Si aucun département n'est affecté, assigner tous les départements de l'endroit
                if (assign.departmentIds.length === 0) {
                    assign.departmentIds = departments.map(dep => dep.id);
                }
                // Vérifier que les départements sont valides
                const invalidDepartments = assign.departmentIds.filter(depId =>
                    !departments.some(dep => dep.id === depId),
                );
                if (invalidDepartments.length > 0) {
                    throw new BadRequestException(`Invalid departments: ${invalidDepartments.join(', ')}`);
                }
            });
    
            // Mettre à jour les affectations opérateurs
            inventory.operatorAssignments = dto.operatorAssignments;
        }
    
        // Sauvegarder l'inventaire mis à jour
        return await this.inventoryRepository.save(inventory);
    }
         // méthode pour supprimer un inventaire 
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


      @Cron(CronExpression.EVERY_MINUTE)
      async autoCloseInventories() {
        const now = new Date();
        // récupère que les inventaires en cours avec la date de fin est passée
        const inventoriesToClose = await this.inventoryRepository.find({
          where: {
            endDate: LessThanOrEqual(now),
          },
          relations: ['status'],
        });
        
        const completedStatus = await this.statusRepository.findOne({
         where: { name: StatusEnum.COMPLETED },
        });
        if (!completedStatus) {
          return;
        }
        for (const inventory of inventoriesToClose) {
           // Ne fermer que ceux qui sont EN COURS
        if (inventory.status?.name === StatusEnum.IN_PROGRESS) {
          inventory.status = completedStatus;
          await this.inventoryRepository.save(inventory);
          const history = this.inventoryStatusHistoryRepository.create({
            inventory,
            status: completedStatus,
          });
          await this.inventoryStatusHistoryRepository.save(history);
          console.log(`Inventory "${inventory.name}" marked as COMPLETED`);
        }
      }
    }


    async getActiveInventory() {
        return this.inventoryRepository.findOne({
            where: { endDate: IsNull() },
        });
    }
}


   