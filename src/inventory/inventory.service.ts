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
import { InventoryStatus } from 'src/inventory-status/entities/inventory-status.entity';
import * as moment from 'moment';
import { NotificationService } from 'src/notification/notification.service';
import { UserRoleEnum } from 'src/user-role/types/enums/user-role.enum';

@Injectable()
export class InventoryService {
  constructor( private readonly inventoryRepository :InventoryRepository,
    private readonly statusRepository : StatusRepository,
    private readonly inventoryStatusRepository : InventoryStatusRepository,
    private readonly userRepository : userRepository,
    private readonly affectationRepository : AffectationRepository,
    private readonly siteRepository : SiteRepository,
    private readonly notificationService : NotificationService
  ){}

 
  //  methode pou get All inventory selon le role 
  async getAllInventories(user: User) {
    // si le role admin doit récupère tous les invetaires 
    if (user.role.role === 'admin') {
      return this.inventoryRepository.findAllWithLatestStatus();
    // si le role opérateur doit récupère leurs inventaires 
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

  /* const now = new Date();
  const startDate = new Date(createinventorydto.startDate);
  const endDate = new Date(createinventorydto.endDate);

  if (startDate < now) {
    throw new BadRequestException('Start date cannot be in the past.');
  }

  if (endDate && startDate > endDate) {
    throw new BadRequestException('Start date must be before or equal to end date.');
  }*/
  
    // Vérifie que le site existe
    const site = await this.siteRepository.findOne({
      where: { id: createinventorydto.siteId },
    });
  
    if (!site) {
      throw new BadRequestException(`Site not found`);
    }
  
    // vérifie que le statut Planned
    const plannedStatus = await this.statusRepository.findOne({
      where: { name: 'Planned', type: 'inventory' },
    });
  
    if (!plannedStatus) {
      throw new BadRequestException(`Default inventory status "Planned" not found`);
    }
  
    // récupération des opérateurs
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
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['site', 'affectations', 'affectations.operator', 'inventoryStatus', 'inventoryStatus.status'],
    });
  
    if (!inventory) return null;
  
    const sortedStatuses = inventory.inventoryStatus.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  
    const latestStatus = sortedStatuses[0];
  
    return {
      ...inventory,
      latestStatus, 
    };
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
    const today = this.getTodayStart();
    const startDate = moment(inventory.startDate).startOf('day').toDate();
    const isBeforeStart = today < startDate;

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
  
    // récupère le dernier statut de l'inventaire
    const lastStatus = await this.inventoryStatusRepository.findOne({
      where: { inventory: { id } },
      order: { createdAt: 'DESC' },
      relations: ['status'],
    });
  
    if (!lastStatus) {
      throw new BadRequestException(`Inventory has no status yet`);
    }
  
    const lastStatusName = lastStatus.status.name;
  
    // empêcher  Si le status en cours
    if (lastStatusName === 'In Progress') {
      throw new BadRequestException(`Inventory is already in progress`);
    }

    // empêcher  Si le status terminé
    if (lastStatusName === 'Completed') {
      throw new BadRequestException(`Cannot launch an inventory that is already completed`);
    }
  
    // lancer seulement si le dernier statut est "Planned"
    if (lastStatusName !== 'Planned') {
      throw new BadRequestException(`Inventory can only be launched if status is "Planned"`);
    } 
    // enregistrer du nouveau statut
    const newInventoryStatus = this.inventoryStatusRepository.create({
      inventory,
      status: inProgressStatus,
    });
    await this.inventoryStatusRepository.save(newInventoryStatus);
    const playerIds = await this.getOperatorsPlayerIdsForInventory(inventory.id); 
    await this.notificationService.notifyOperators(
      playerIds,
      'Inventory Launched',
      `The inventory "${inventory.name}" has started.`
    );
    return {
      message: `Inventory "${inventory.name}" has been launched`,
      inventoryId: inventory.id,
      status: inProgressStatus.name,
    };
  }
  async getOperatorsPlayerIdsForInventory(inventoryId: string) {
    const affectations = await this.affectationRepository.find({
      where: { inventory: { id: inventoryId } },
      relations: ['operator'],
    });
  
    return affectations
      .map(a => a.operator?.playerId) 
      .filter(pid => !!pid);
  }
  
  /*
  async getActiveInventory() {
    return this.inventoryRepository.findActiveInventory();

  }*/
  
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

  // Mise à jour de startDate uniquement si le statut est "Planned"
    if (dto.startDate) {
      if (lastStatusName !== 'Planned') {
        throw new BadRequestException('startDate can only be updated when the inventory status is "Planned"');
      }
      inventory.startDate = new Date(dto.startDate);
    }  
   //  Mise à jour du endDate si statut Planned ou Expired
    if (dto.endDate) {
    if (lastStatusName !== InventoryStatusEnum.Planned && lastStatusName !== InventoryStatusEnum.EXPIRED) {
      throw new BadRequestException('endDate can only be updated when the inventory status is "Planned" or "Expired"');
    }

    inventory.endDate = new Date(dto.endDate);
    // Si le statut était Expired  repasser à In Progress
    if (lastStatusName === InventoryStatusEnum.EXPIRED) {
      const inProgressStatus = await this.statusRepository.findOne({
        where: { name: InventoryStatusEnum.IN_PROGRESS, type: 'inventory' },
      });

      if (!inProgressStatus) {
        throw new BadRequestException('Status "In Progress" not found');
      }

      const newStatus = this.inventoryStatusRepository.create({
        inventory,
        status: inProgressStatus,
      });
      
    await this.inventoryRepository.save(inventory); 
    const newInventoryStatus = await this.inventoryStatusRepository.save(newStatus);

    return {
      inventory,
      status: newInventoryStatus,
      statusUpdated: true,
    };
  }
  }
     //  Sauvegarder l'inventaire
     const savedInventory = await this.inventoryRepository.save(inventory);

     if (dto.operatorId) {
      if (lastStatusName !== InventoryStatusEnum.IN_PROGRESS) {
        throw new BadRequestException('Operator can only be assigned when inventory is "In Progress"');
      }
    
      const newOperator = await this.userRepository.findOne({
        where: { id: dto.operatorId },
        relations: ['role'], // pour accéder au rôle de l'utilisateur
      });
    
      if (!newOperator) {
        throw new BadRequestException(`Operator with ID ${dto.operatorId} not found`);
      }
    
      if (newOperator.role.role !== UserRoleEnum.OPERATOR) {
        throw new BadRequestException('Only users with the "operator" role can be assigned to an inventory');
      }
    
      // Vérifie si l’opérateur est déjà affecté à cet inventaire
      const existingAffectation = await this.affectationRepository.findOne({
        where: {
          inventory: { id },
          operator: { id: dto.operatorId },
        },
      });
    
      if (existingAffectation) {
        throw new BadRequestException('This operator is already assigned to the inventory');
      }
    
      // Crée une nouvelle affectation (sans supprimer les anciennes)
      const newAffectation = this.affectationRepository.create({
        inventory,
        operator: newOperator,
      });
    
      await this.affectationRepository.save(newAffectation);
    }
    
    // Recharge complet de l'inventaire avec les statuts et le site
    const updatedInventory = await this.inventoryRepository.findOne({
      where: { id: savedInventory.id },
      relations: ['inventoryStatus', 'inventoryStatus.status', 'site','affectations',
    'affectations.operator'],
    });
  
    if (!updatedInventory) {
      throw new InternalServerErrorException('Failed to reload updated inventory');
    }
  
    // tri les statuts par date de création
    updatedInventory.inventoryStatus.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  
    return {
      updatedInventory,
      statusUpdated,
    };
  }

  private getTodayStart(): Date {
    return moment().startOf('day').toDate();
  }

  @Cron('*/1 * * * *')
  async handleExpiredInventories() {
  const expiredStatus = await this.statusRepository.findOne({
    where: { name: InventoryStatusEnum.EXPIRED, type: 'inventory' },
  });

  if (!expiredStatus) {
    throw new BadRequestException('Status "Expired" not found');
  }

  const today = this.getTodayStart();

  const expiredInventories = await this.inventoryRepository.find({
    where: {
      endDate: LessThan(today),
    },
    relations: ['inventoryStatus', 'inventoryStatus.status'],
  });

  if (expiredInventories.length === 0) {
    return;
  }

  let expiredCount = 0;

  for (const inventory of expiredInventories) {
    const sortedStatuses = inventory.inventoryStatus.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const lastStatus = sortedStatuses[0];

    if (!lastStatus) {
      continue;
    }

    const alreadyExpired = inventory.inventoryStatus.some(
      (statusEntry) => statusEntry.status.name === InventoryStatusEnum.EXPIRED
    );

    if (alreadyExpired) {
      continue;
    }

    if (lastStatus.status.name !== InventoryStatusEnum.IN_PROGRESS) {
      continue;
    }

    // Ajouter le statut "Expired"
    const expiredEntry = this.inventoryStatusRepository.create({
      inventory,
      status: expiredStatus,
    });

    await this.inventoryStatusRepository.save(expiredEntry);
    expiredCount++;

    // Nettoyage des doublons après insertion
    const allExpiredStatuses = await this.inventoryStatusRepository.find({
      where: {
        inventory: { id: inventory.id },
        status: { id: expiredStatus.id },
      },
      order: { createdAt: 'DESC' },
    });

    if (allExpiredStatuses.length > 1) {
      // On garde le plus récent, on supprime les autres
      const [latest, ...duplicates] = allExpiredStatuses;
      const idsToDelete = duplicates.map((d) => d.id);
      await this.inventoryStatusRepository.delete(idsToDelete);
    }
  }
}

}







   