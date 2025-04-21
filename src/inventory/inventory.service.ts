import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from './repositories/inventory.repository';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { InventoryStatusRepository } from 'src/inventory-status/repositories/inventory-status.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { userRepository } from 'src/user/repositories/user.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';
import { User } from 'src/user/entities/user.entity';
import { In, LessThan, Not } from 'typeorm';
import { Cron} from '@nestjs/schedule';
import { InventoryStatusEnum } from 'src/status/types/enums/inventory-status.enum';
import { UpdateInventoryDto } from './types/dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { InventoryStatus } from 'src/inventory-status/entities/inventory-status.entity';


@Injectable()
export class InventoryService {
  constructor( private readonly inventoryRepository :InventoryRepository,
    private readonly statusRepository : StatusRepository,
    private readonly inventoryStatusRepository : InventoryStatusRepository,
    private readonly userRepository : userRepository,
    private readonly affectationRepository : AffectationRepository,
    private readonly siteRepository : SiteRepository
  ){}

 
  //  methode pou get All inventory selon le role 
  async getAllInventories(user: User) {
    if (user.role.role === 'admin') {
      return this.inventoryRepository.findAllWithLatestStatus();
    } else if (user.role.role === 'operator') {
      return this.inventoryRepository.findInventoriesByOperatorIdWithStatus(user.id);
    } else {
      return [];
    }
  }
  


  // methode pour la creation inventaire
  async createInventory(createinventorydto: CreateInventoryDto) {
    const existing = await this.inventoryRepository.findOne({
      where: { name: createinventorydto.name },
    });
  
    if (existing) {
      throw new BadRequestException(`Inventory with name "${createinventorydto.name}" already exists`);
    }
  
    // Vérifie que le site existe
    const site = await this.siteRepository.findOne({
      where: { id: createinventorydto.siteId },
    });
  
    if (!site) {
      throw new BadRequestException(`Site not found`);
    }
  
    //  Vérifie que le statut "Planned" existe AVANT d'enregistrer l'inventaire
    const plannedStatus = await this.statusRepository.findOne({
      where: { name: 'Planned', type: 'inventory' },
    });
  
    if (!plannedStatus) {
      throw new BadRequestException(`Default inventory status "Planned" not found`);
    }
  
    // Récupération des opérateurs
    let operators: User[] = [];
  
    if (createinventorydto.allOperators) {
      operators = await this.userRepository.findAllOperators();
  
      if (operators.length === 0) {
        throw new BadRequestException(`No operators found in the system.`);
      }
  
    } else if (createinventorydto.operatorIds?.length > 0) {
      operators = await this.userRepository.find({
        where: { id: In(createinventorydto.operatorIds) },
        relations: ['role'],
      });
  
      if (operators.length !== createinventorydto.operatorIds.length) {
        throw new BadRequestException(`One or more operator IDs are invalid.`);
      }
  
      const invalidUsers = operators.filter(
        (user) => user.role?.role !== 'operator'
      );
  
      if (invalidUsers.length > 0) {
        const invalidIds = invalidUsers.map((u) => u.id).join(', ');
        throw new BadRequestException(`The following users are not operators: ${invalidIds}`);
      }
  
    } else {
      throw new BadRequestException(`You must select at least one operator or choose "All Operators".`);
    }
  
    const newInventory = this.inventoryRepository.create({
      ...createinventorydto,
      site,
    });
  
    const savedInventory = await this.inventoryRepository.save(newInventory);
  
    const newStatus = this.inventoryStatusRepository.create({
      inventory: savedInventory,
      status: plannedStatus,
    });
  
    await this.inventoryStatusRepository.save(newStatus);
  
    const affectations = operators.map((operator) =>
      this.affectationRepository.create({
        inventory: savedInventory,
        operator,
      }),
    );
    await this.affectationRepository.save(affectations);
  
    return savedInventory;
  }
  //  methode pour get inventory By Id
  async getInventoryById(id: string) {
    return this.inventoryRepository.findOne({
      where: { id },
      relations: ['site', 'affectations', 'affectations.operator'],
    });
  }
// methode pour lancer inventaire
  async launchInventory(id: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new BadRequestException(`Inventory not found`);
    }
  
    // Vérifier s'il y a déjà un inventaire en cours
    const inProgressInventory = await this.inventoryRepository.findOne({
      where: { id: Not(id) }, // Trouver un inventaire qui n'est pas celui en cours
      relations: ['inventoryStatus'],
    });
  
    if (inProgressInventory) {
      // Recherche d'un statut "In Progress" dans les autres inventaires
      const inProgressStatus = inProgressInventory.inventoryStatus.find(
        status => status.status.name === 'In Progress',
      );
  
      if (inProgressStatus) {
        throw new BadRequestException('There is already an inventory in progress');
      }
    }
  
    // Vérifier la date de début
    const today = new Date();
    const startDate = new Date(inventory.startDate);
  
    const isBeforeStart = today.setHours(0, 0, 0, 0) < startDate.setHours(0, 0, 0, 0);
    if (isBeforeStart) {
      throw new BadRequestException(`Cannot launch inventory before its start date`);
    }
  
    // Vérifie l'existence du statut "In Progress"
    const inProgressStatus = await this.statusRepository.findOne({
      where: { name: 'In Progress', type: 'inventory' },
    });
  
    if (!inProgressStatus) {
      throw new BadRequestException(`Status "In Progress" not found`);
    }
  
    // Récupère le dernier statut de l'inventaire
    const lastStatus = await this.inventoryStatusRepository.findOne({
      where: { inventory: { id } },
      order: { createdAt: 'DESC' },
      relations: ['status'],
    });
  
    if (!lastStatus) {
      throw new BadRequestException(`Inventory has no status yet`);
    }
  
    const lastStatusName = lastStatus.status.name;
  
    // Empêcher  Si le status en cours
    if (lastStatusName === 'In Progress') {
      throw new BadRequestException(`Inventory is already in progress`);
    }
  
    // Empêcher  Si le status terminé
    if (lastStatusName === 'Completed') {
      throw new BadRequestException(`Cannot launch an inventory that is already completed`);
    }
  
    // Lancer seulement si le dernier statut est "Planned"
    if (lastStatusName !== 'Planned') {
      throw new BadRequestException(`Inventory can only be launched if status is "Planned"`);
    }
  
    // Enregistrement du nouveau statut
    const newInventoryStatus = this.inventoryStatusRepository.create({
      inventory,
      status: inProgressStatus,
    });
  
    await this.inventoryStatusRepository.save(newInventoryStatus);
  
    return {
      message: `Inventory "${inventory.name}" has been launched`,
      inventoryId: inventory.id,
      status: inProgressStatus.name,
    };
  }
  
  //  methode pour delete Inventory
  async deleteInventory(id: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
  
    if (!inventory) {
      throw new BadRequestException(`Inventory with ID ${id} not found`);
    }
  
    // Vérifie le dernier statut de l'inventaire
    const lastStatus = await this.inventoryStatusRepository.findOne({
      where: { inventory: { id } },
      order: { createdAt: 'DESC' },
      relations: ['status'],
    });
  
    const statusName = lastStatus?.status.name;
  
    if (statusName === 'In Progress' || statusName === 'Completed') {
      throw new BadRequestException(`Cannot delete inventory in status "${statusName}"`);
    }
  
    await this.inventoryRepository.remove(inventory);
  
    return {
      message: `Inventory "${inventory.name}" has been deleted successfully.`,
      inventoryId: inventory.id,
    };
  }
//  methode pour update inventory 
  async updateInventory(id: string, dto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['inventoryStatus'],
    });
  
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
  
    // Recherche du dernier statut de l'inventaire
    const lastStatus = await this.inventoryStatusRepository.findOne({
      where: { inventory: { id } },
      order: { createdAt: 'DESC' },
      relations: ['status'],
    });
  
    if (!lastStatus) {
      throw new BadRequestException(`Inventory has no status yet`);
    }
  
    const lastStatusName = lastStatus.status.name;
    let statusUpdated = false;
  
  // Mise à jour vers "Completed"
  if (dto.statusId) {
    const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });
    if (!status) {
      throw new BadRequestException(`Status with ID ${dto.statusId} not found`);
    }

    // verifier le status n'est pas Completed
    if (status.name !== 'Completed') {
      throw new BadRequestException('Inventory status can only be updated to "Completed"');
    }
    // verifier le status n'est pas In Progress
    if (lastStatusName !== 'In Progress') {
      throw new BadRequestException('Inventory can only be completed if the current status is "In Progress"');
    }

    const saveInventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!saveInventory) {
      throw new InternalServerErrorException('Inventory not found');
    }

    // Créer un objet compatible avec TypeORM pour la mise à jour du statut
    const newInventoryStatus = this.inventoryStatusRepository.create({
      inventory: saveInventory,
      status: status,
    });

    // Sauvegarde du nouveau statut
    const newInventoryStatusRecord = await this.inventoryStatusRepository.save(newInventoryStatus);
    statusUpdated = true;

    // Retourner les informations mises à jour
    return {
      inventory: saveInventory,
      status: newInventoryStatusRecord,
      statusUpdated: statusUpdated,
    };
  }
    // Mise à jour des champs si présents
    if (dto.name) inventory.name = dto.name;
    if (dto.endDate) inventory.endDate = new Date(dto.endDate);
  
    // Sauvegarde de l'inventaire avec les nouvelles informations
    const savedInventory = await this.inventoryRepository.save(inventory);
  
    // Si endDate modifiée et statut actuel = "Expired", revenir à "In Progress"
    if (dto.endDate && lastStatusName === InventoryStatusEnum.EXPIRED) {
      const inProgressStatus = await this.statusRepository.findOne({
        where: { name: InventoryStatusEnum.IN_PROGRESS, type: 'inventory' },
      });
  
      if (!inProgressStatus) {
        throw new BadRequestException(`Status "In Progress" not found`);
      }
  
      // Vérification de l'inventaire avant création du nouveau statut
      const saveInventory2 = await this.inventoryRepository.findOne({ where: { id } });
  
      if (!saveInventory2) {
        throw new InternalServerErrorException('Inventory not found');
      }
  
      // Création du statut "In Progress"
      const newStatus = this.inventoryStatusRepository.create({
        inventory: saveInventory2,
        status: inProgressStatus,
      });
  
      await this.inventoryStatusRepository.save(newStatus);
      statusUpdated = true;
    }
  
    // Recharge complet de l'inventaire avec les statuts et le site
    const updatedInventory = await this.inventoryRepository.findOne({
      where: { id: savedInventory.id },
      relations: ['inventoryStatus', 'inventoryStatus.status', 'site'],
    });
  
    if (!updatedInventory) {
      throw new InternalServerErrorException('Failed to reload updated inventory');
    }
  
    // Tri des statuts par date de création
    updatedInventory.inventoryStatus.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  
    // Retour des données mises à jour et de l'indication de mise à jour du statut
    return {
      updatedInventory,
      statusUpdated,
    };
  }
  
  
  
   // CRON  exécuté toutes les minutes pour tester les inventaire dont la date de fin est passée
  @Cron('*/1 * * * *')
  async handleExpiredInventories() {
    const logger = new Logger(InventoryService.name);
    
    // Créer une date avec les heures réglées à minuit pour une comparaison cohérente
    const today = new Date();
     // Réinitialise l'heure à minuit pour la comparaison
    today.setHours(0, 0, 0, 0); 
  
    logger.log('CRON Checking for expired inventories...');
  
    // Obtenir tous les inventaires dont la date de fin est passée
    const expiredInventories = await this.inventoryRepository.find({
      where: {
        endDate: LessThan(today), 
      },
      relations: ['inventoryStatus'],
    });
  
    if (expiredInventories.length === 0) {
      logger.log('No expired inventories found');
      return;
    }
  
    const expiredStatus = await this.statusRepository.findOne({
      where: { name: InventoryStatusEnum.EXPIRED, type: 'inventory' },
    });
  
    if (!expiredStatus) {
      logger.error('Status Expired not found');
      throw new BadRequestException('Status "Expired" not found');
    }
  
    let expiredCount = 0;
  
    for (const inventory of expiredInventories) {
      logger.log(`Checking inventory: ${inventory.name} (ID: ${inventory.id})`);
  
      const lastStatus = await this.inventoryStatusRepository.findOne({
        where: { inventory: { id: inventory.id } },
        order: { createdAt: 'DESC' },
        relations: ['status'],
      });
  
      if (!lastStatus) {
        logger.warn(`No status found for inventory ${inventory.name}`);
        continue;
      }
  
      if (lastStatus.status.name === InventoryStatusEnum.EXPIRED) {
        logger.log(`Inventory "${inventory.name}" is already marked as expired, skipping`);
        continue; // Si l'inventaire est déjà marqué comme expiré, on passe
      }
  
      if (lastStatus.status.name !== InventoryStatusEnum.IN_PROGRESS) {
        logger.log(`Last status = ${lastStatus.status.name} → skipped`);
        continue;
      }
  
      // Marquer l'inventaire comme expiré s'il est "In Progress"
      const expiredEntry = this.inventoryStatusRepository.create({
        inventory,
        status: expiredStatus,
      });
  
      await this.inventoryStatusRepository.save(expiredEntry);
      logger.log(`Inventory "${inventory.name}" marked as expired`);
      expiredCount++;
    }
  
    logger.log(`Done: ${expiredCount} expired inventory(ies) updated`);
  }
  


}







   