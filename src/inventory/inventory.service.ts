import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from './repositories/inventory.repository';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { InventoryStatusRepository } from 'src/inventory-status/repositories/inventory-status.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { userRepository } from 'src/user/repositories/user.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';
import { User } from 'src/user/entities/user.entity';
import { Between, In, IsNull, LessThan, Not } from 'typeorm';
import { Cron} from '@nestjs/schedule';
import { InventoryStatusEnum } from 'src/status/types/enums/inventory-status.enum';
import { UpdateInventoryDto } from './types/dto/update-inventory.dto';
import * as moment from 'moment';
import { NotificationService } from 'src/notification/notification.service';
import { UserRoleEnum } from 'src/user-role/types/enums/user-role.enum';
import { IUserRole } from 'src/user-role/types/interface/user-role.interface';
import { IUser } from 'src/user/types/interface/user.interface';
import { Isite } from 'src/site/Types/interfaces/site.interface';
import { IinventoryStatus } from 'src/inventory-status/types/interfaces/inventory-status.interface';
import { Istatus } from 'src/status/types/interfaces/status.interface';
import { LocationRepository } from 'src/location/repositories/location.repository';


@Injectable()
export class InventoryService {
  constructor( private readonly inventoryRepository :InventoryRepository,
    private readonly statusRepository : StatusRepository,
    private readonly inventoryStatusRepository : InventoryStatusRepository,
    private readonly userRepository : userRepository,
    private readonly affectationRepository : AffectationRepository,
    private readonly siteRepository : SiteRepository,
    private readonly notificationService : NotificationService,
    private readonly  locationRepository :LocationRepository
  ){}

 
  //  methode pou get All inventory selon le role 
  async getAllInventories(user: User) {
    let role = user.role as IUserRole;
    // si le role admin doit récupère tous les invetaires 
    if (role.role === 'admin') {
      return this.inventoryRepository.findAllWithLatestStatus();
    // si le role opérateur doit récupère leurs inventaires 
    } else if (role.role === 'operator') {
      return this.inventoryRepository.findInventoriesByOperatorIdWithStatus(user.id);
    } else {
      return [];
    }
  }
  
  
  async createInventory(createinventorydto: CreateInventoryDto) {
    const existing = await this.inventoryRepository.findOne({
      where: { name: createinventorydto.name },
    });

    if (existing) {
      throw new BadRequestException(`Inventory with name "${createinventorydto.name}" already exists`);
    }

    // Vérifie les chevauchements avec les inventaires existants du même site en appelant la méthode du repository
    const startDate = new Date(createinventorydto.startDate);
    const endDate = new Date(createinventorydto.endDate);

    // Vérifie que la date de début n'est pas dans le passé
    const today = this.getTodayStart(); 
    if (startDate < today) {
      throw new BadRequestException(`Start date cannot be in the past`);
    }

    // Vérifie que la date de fin est après la date de début
   if (endDate < startDate) {
    throw new BadRequestException(`End date cannot be before start date`);
  }

    const overlappingInventory = await this.inventoryRepository.findOverlappingInventory(
      createinventorydto.siteId,
      startDate,
      endDate,
    );

    if (overlappingInventory) {
      const formattedStartDate = new Date(overlappingInventory.startDate).toDateString();
      const formattedEndDate = new Date(overlappingInventory.endDate).toDateString();

      throw new BadRequestException(
        `An inventory already exists in the selected date range for the site (from ${formattedStartDate} to ${formattedEndDate}).`,
      );
    }

    // Vérifie que le site existe
    const site = await this.siteRepository.findOne({
      where: { id: createinventorydto.siteId },
    });

    if (!site) {
      throw new BadRequestException(`Site not found`);
    }

    // Vérifie que le statut Planned existe
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
      
      const invalidUsers = operators.filter((user) => {
        const role = user.role as IUserRole;
        return  role.role !== 'operator';
      });

      if (invalidUsers.length > 0) {
        const invalidIds = invalidUsers.map((u) => u.id).join(', ');
        throw new BadRequestException(`The following users are not operators: ${invalidIds}`);
      }

    } else {
      throw new BadRequestException(`You must select at least one operator or choose "All Operators".`);
    }

    // Création de l'inventaire
    const newInventory = this.inventoryRepository.create({
      ...createinventorydto,
      site,
    });
    const savedInventory = await this.inventoryRepository.save(newInventory);

    // Ajoute le statut "Planned"
    const newStatus = this.inventoryStatusRepository.create({
      inventory: savedInventory,
      status: plannedStatus,
    });

    await this.inventoryStatusRepository.save(newStatus);

    // Vérifie et associe les locations
const locations = await this.locationRepository.findBy({
  id: In(createinventorydto.locationIds),
});

if (locations.length !== createinventorydto.locationIds.length) {
  throw new BadRequestException(`One or more location IDs are invalid.`);
}

// Affecte l'inventaire à chaque location
for (const location of locations) {
  location.inventory = savedInventory;
}
await this.locationRepository.save(locations);


    // Affectation des opérateurs
    const affectations = operators.map((operator) =>
      this.affectationRepository.create({
        inventory: savedInventory,
        operator,
      }),
    );
    await this.affectationRepository.save(affectations);

    // Récupère les playerIds des opérateurs affectés
    const playerIds = operators
  .map((op) => op.playerId)
  .filter((pid) => !!pid); 
  const start = new Date(savedInventory.startDate);
  const end = new Date(savedInventory.endDate);
  await this.notificationService.notifyOperators(
  playerIds,
  'Inventory Assigned',
  `You have been assigned to the inventory "${savedInventory.name}" from ${start.toDateString()} to ${end.toDateString()}.`
);
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
  async launchInventory(id: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
  
    if (!inventory) {
      throw new BadRequestException('Inventory not found');
    }
  
    // vérifier si à un autre inventaire en cours
    const otherInventories = await this.inventoryRepository.find({
      where: { id: Not(id) },
    });
  
    for (const otherInventory of otherInventories) {
      const lastStatus = await this.inventoryStatusRepository.findOne({
        where: { inventory: { id: otherInventory.id } },
        order: { createdAt: 'DESC' },
        relations: ['status'],
      });
     let status = lastStatus?.status as Istatus;
      if (status.name === 'In Progress') {
        throw new BadRequestException('There is already an inventory in progress');
      }
    }
  
    // vérifier la date de début
    const today = new Date();
    const startDate = new Date(inventory.startDate);
    const isBeforeStart = today.setHours(0, 0, 0, 0) < startDate.setHours(0, 0, 0, 0);
  
    if (isBeforeStart) {
      throw new BadRequestException('Cannot launch inventory before its start date');
    }
  
    // vérifie l'existence du statut "In Progress"
    const inProgressStatus = await this.statusRepository.findOne({
      where: { name: 'In Progress', type: 'inventory' },
    });
  
    if (!inProgressStatus) {
      throw new BadRequestException('Status "In Progress" not found');
    }
  
    // récupère le dernier statut de l'inventaire
    const lastStatus = await this.inventoryStatusRepository.findOne({
      where: { inventory: { id } },
      order: { createdAt: 'DESC' },
      relations: ['status'],
    });
  
    if (!lastStatus) {
      throw new BadRequestException('Inventory has no status yet');
    }
   let status = lastStatus.status as Istatus;
    const lastStatusName = status.name;
  
    if (lastStatusName === 'In Progress') {
      throw new BadRequestException('Inventory is already in progress');
    }
  
    if (lastStatusName === 'Completed') {
      throw new BadRequestException('Cannot launch an inventory that is already completed');
    }
  
    if (lastStatusName !== 'Planned') {
      throw new BadRequestException('Inventory can only be launched if status is "Planned"');
    }
  
    // Enregistrement du nouveau statut
    const newInventoryStatus = this.inventoryStatusRepository.create({
      inventory,
      status: inProgressStatus,
    });
  
    await this.inventoryStatusRepository.save(newInventoryStatus);
  
    // Notification aux opérateurs
    const playerIds = await this.getOperatorsPlayerIdsForInventory(inventory.id);
  
    await this.notificationService.notifyOperators(
      playerIds,
      'Inventory Launched',
      `The inventory "${inventory.name}" has started.`
    );
  
    const updatedInventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['inventoryStatus', 'inventoryStatus.status'],
    });
  
    return updatedInventory;
  }

  async getOperatorsPlayerIdsForInventory(inventoryId: string) {
  const affectations = await this.affectationRepository.find({
    where: { inventory: { id: inventoryId } },
    relations: ['operator'],
  });

  return affectations
    .map(a => {
      let  operator = a.operator as IUser;
      return operator?.playerId;
    })
    .filter((pid): pid is string => !!pid);
}

 
  
  /*
  async getActiveInventory() {
    return this.inventoryRepository.findActiveInventory();

  }*/
  
//  methode pour update inventory 
async updateInventory(id: string, dto: UpdateInventoryDto) {
  const inventory = await this.inventoryRepository.findOne({
    where: { id },
    relations: ['inventoryStatus', 'site'],
  });

  if (!inventory) {
    throw new NotFoundException(`Inventory with ID ${id} not found`);
  }

  const lastStatus = await this.inventoryStatusRepository.findOne({
    where: { inventory: { id } },
    order: { createdAt: 'DESC' },
    relations: ['status'],
  });

  if (!lastStatus) {
    throw new BadRequestException(`Inventory has no status yet`);
  }

  let status = lastStatus.status as Istatus;
  const lastStatusName = status.name;
  let statusUpdated = false;

  const now = new Date();

  // Validation de la startDate
  if (dto.startDate) {
    const startDate = new Date(dto.startDate);
    if (startDate < now) {
      throw new BadRequestException('startDate cannot be in the past');
    }

    if (lastStatusName !== 'Planned') {
      throw new BadRequestException('startDate can only be updated when the inventory status is "Planned"');
    }

    inventory.startDate = startDate;
  }

  // Validation de l’endDate
  if (dto.endDate) {
    const endDate = new Date(dto.endDate);
    if (inventory.startDate && endDate < inventory.startDate) {
      throw new BadRequestException('endDate cannot be earlier than startDate');
    }

    if (lastStatusName !== InventoryStatusEnum.Planned && lastStatusName !== InventoryStatusEnum.EXPIRED) {
      throw new BadRequestException('endDate can only be updated when the inventory status is "Planned" or "Expired"');
    }

    inventory.endDate = endDate;

    // Si le statut était Expired, repasser à In Progress
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
  // Vérification de chevauchement d’un autre inventaire sur le même site
  const startDateToCheck = dto.startDate ? new Date(dto.startDate) : inventory.startDate;
  const endDateToCheck = dto.endDate ? new Date(dto.endDate) : inventory.endDate;
  let site = inventory.site as Isite;
  const overlappingInventory = await this.inventoryRepository.findOverlappingInventoryexcludeId(
  site.id,
  startDateToCheck,
  endDateToCheck,
  inventory.id, 
);

 if (overlappingInventory) {
    // Conversion explicite des dates en string ISO (yyyy-mm-dd)
    const overlapStartDate = new Date(overlappingInventory.startDate).toISOString().slice(0, 10);
    const overlapEndDate = new Date(overlappingInventory.endDate).toISOString().slice(0, 10);

    throw new BadRequestException(
      `Inventory dates overlap with another inventory from ${overlapStartDate} to ${overlapEndDate}`
    );
  }

  // Mise à jour du nom
  if (dto.name) inventory.name = dto.name;

  // Mise à jour du statut vers "Completed"
 if (dto.statusId) {
  const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });
  if (!status) {
    throw new BadRequestException(`Status with ID ${dto.statusId} not found`);
  }

  if (status.name !== 'Completed') {
    throw new BadRequestException('Inventory status can only be updated to "Completed"');
  }

  if (lastStatusName !== 'In Progress') {
    throw new BadRequestException('Inventory can only be completed if the current status is "In Progress"');
  }

  const newInventoryStatus = this.inventoryStatusRepository.create({
    inventory,
    status,
  });

  const savedStatus = await this.inventoryStatusRepository.save(newInventoryStatus);
  statusUpdated = true;

  
  return {
    inventory,
    status: savedStatus,
    statusUpdated,
  };
}

const savedInventory = await this.inventoryRepository.save(inventory);

  // Assignation opérateur
if (dto.operatorId) {
  // Interdire  si le statut est "Completed" ou "Expired"
  if (
    lastStatusName === InventoryStatusEnum.COMPLETED ||
    lastStatusName === InventoryStatusEnum.EXPIRED
  ) {
    throw new BadRequestException(
      'Operator cannot be assigned when inventory is "Completed" or "Expired"',
    );
  }

  // Autorisé  pour "Planned" ou "In Progress"
  if (
    lastStatusName !== InventoryStatusEnum.Planned &&
    lastStatusName !== InventoryStatusEnum.IN_PROGRESS
  ) {
    throw new BadRequestException(
      'Operator can only be assigned when inventory is "Planned" or "In Progress"',
    );
  }

  const newOperator = await this.userRepository.findOne({
    where: { id: dto.operatorId },
    relations: ['role'],
  });

  if (!newOperator) {
    throw new BadRequestException(`Operator with ID ${dto.operatorId} not found`);
  }
 let role = newOperator.role as IUserRole;
  if (role.role !== UserRoleEnum.OPERATOR) {
    throw new BadRequestException('Only users with the "operator" role can be assigned to an inventory');
  }

  const existingAffectation = await this.affectationRepository.findOne({
    where: {
      inventory: { id },
      operator: { id: dto.operatorId },
    },
  });

  if (existingAffectation) {
    throw new BadRequestException('This operator is already assigned to the inventory');
  }

  const newAffectation = this.affectationRepository.create({
    inventory,
    operator: newOperator,
  });

  await this.affectationRepository.save(newAffectation);
  // Notifier l'opérateur affecté
if (newOperator.playerId) {
  await this.notificationService.notifyOperators(
    [newOperator.playerId],
    'New Inventory Assignment',
    `You have been assigned to the inventory "${inventory.name}" from ${inventory.startDate.toDateString()} to ${inventory.endDate.toDateString()}.`,
  );
}
}

  const updatedInventory = await this.inventoryRepository.findOne({
    where: { id: savedInventory.id },
    relations: ['inventoryStatus', 'inventoryStatus.status', 'site', 'affectations', 'affectations.operator'],
  });

  if (!updatedInventory) {
    throw new InternalServerErrorException('Failed to reload updated inventory');
  }

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

  if (expiredInventories.length === 0) return;

  let expiredCount = 0;

  for (const inventory of expiredInventories) {
    //  filtre les strings
    const statuses = inventory.inventoryStatus.filter(
      (s): s is IinventoryStatus => typeof s !== 'string'
    );

    const sortedStatuses = statuses.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const lastStatus = sortedStatuses[0];
    if (!lastStatus) continue;
    const alreadyExpired = statuses.some(
      (statusEntry) =>
        typeof statusEntry.status !== 'string' &&
      statusEntry.status.name === InventoryStatusEnum.EXPIRED
    );

    if (alreadyExpired) continue;
    let status=lastStatus.status as Istatus;

    if (status.name !== InventoryStatusEnum.IN_PROGRESS) continue;

    const expiredEntry = this.inventoryStatusRepository.create({
      inventory,
      status: expiredStatus,
    });

    await this.inventoryStatusRepository.save(expiredEntry);
    expiredCount++;

    // Supprimer les doublons Expired
    const allExpiredStatuses = await this.inventoryStatusRepository.find({
      where: {
        inventory: { id: inventory.id },
        status: { id: expiredStatus.id },
      },
      order: { createdAt: 'DESC' },
    });

    if (allExpiredStatuses.length > 1) {
      const [latest, ...duplicates] = allExpiredStatuses;
      const idsToDelete = duplicates.map((d) => d.id);
      await this.inventoryStatusRepository.delete(idsToDelete);
    }
     const admins = await this.userRepository.find({
      where: {
        role: { role: UserRoleEnum.ADMIN },
        playerId: Not(IsNull()),
      },
      relations: ['role'],
    });

    const playerIds = admins.map((admin) => admin.playerId).filter(Boolean);
    if (playerIds.length > 0) {
      const title = 'Expired Inventory';
      const message = `The inventory "${inventory.name}" has expired.`;

      await this.notificationService.notifyOperators(playerIds, title, message);
    }
  }
}

@Cron('*/5 * * * *')
async handlePlannedInventoriesToLaunch() {
  const startOfDay = this.getTodayStart();
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const plannedInventories = await this.inventoryRepository.find({
    where: {
      startDate: Between(startOfDay, endOfDay),
    },
  });

  if (plannedInventories.length === 0) return;

  const inProgressStatus = await this.statusRepository.findOne({
    where: { name: InventoryStatusEnum.IN_PROGRESS, type: 'inventory' },
  });

  if (!inProgressStatus) {
    console.warn('In Progress status not found.');
    return;
  }

  let launchedCount = 0;

  for (const inventory of plannedInventories) {
    const lastStatus = await this.inventoryStatusRepository.findOne({
      where: { inventory: { id: inventory.id } },
      relations: ['status'],
      order: { createdAt: 'DESC' },
    });
    let status = lastStatus?.status as Istatus;
    if (!lastStatus || status.name !== InventoryStatusEnum.Planned) {
      continue;
    }

    // Vérification atomique simple via count
    const inProgressCount = await this.inventoryStatusRepository.count({
      where: {
        inventory: { id: inventory.id },
        status: { name: InventoryStatusEnum.IN_PROGRESS },
      },
    });

    if (inProgressCount > 0) {
      continue; // Statut In Progress déjà présent
    }

    const newStatus = this.inventoryStatusRepository.create({
      inventory,
      status: inProgressStatus,
    });

    try {
      await this.inventoryStatusRepository.save(newStatus);
      launchedCount++;

      const playerIds = await this.getOperatorsPlayerIdsForInventory(inventory.id);
      await this.notificationService.notifyOperators(
        playerIds,
        'Inventory Launched',
        `The inventory "${inventory.name}" has started.`,
      );
    } catch (error) {
      console.warn(`Failed to save In Progress status for inventory ${inventory.id}:`, error.message);
    }
  }

  console.log(`${launchedCount} inventory(ies) have been launched.`);
}

}