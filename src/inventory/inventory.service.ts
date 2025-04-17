import { BadRequestException, Injectable } from '@nestjs/common';
import { InventoryRepository } from './repositories/inventory.repository';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { InventoryStatusRepository } from 'src/inventory-status/repositories/inventory-status.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { userRepository } from 'src/user/repositories/user.repository';
import { AffectationRepository } from 'src/affectation/repositories/affectation.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';
import { User } from 'src/user/entities/user.entity';
import { In } from 'typeorm';
import { Cron } from '@nestjs/schedule';


@Injectable()
export class InventoryService {
  constructor( private readonly inventoryRepository :InventoryRepository,
    private readonly statusRepository : StatusRepository,
    private readonly inventoryStatusRepository : InventoryStatusRepository,
    private readonly userRepository : userRepository,
    private readonly affectationRepository : AffectationRepository,
    private readonly siteRepository : SiteRepository
  ){}
  // methode pour la creation inventaire
  async createInventory(createinventorydto: CreateInventoryDto) {
    // Vérifie l'unicité du nom
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
  
    // Création du statut de l’inventaire
    const newStatus = this.inventoryStatusRepository.create({
      inventory: savedInventory,
      status: plannedStatus,
    });
  
    await this.inventoryStatusRepository.save(newStatus);
  
    // Affectations
    const affectations = operators.map((operator) =>
      this.affectationRepository.create({
        inventory: savedInventory,
        operator,
      }),
    );
    await this.affectationRepository.save(affectations);
  
    return savedInventory;
  }
  


  async launchInventory(id: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new BadRequestException(`Inventory not found`);
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
 
  @Cron('0 0 * * *') // Tous les jours à minuit
async checkForExpiredInventories() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inProgressOrPlannedInventories = await this.inventoryRepository.findWithStatuses(['Planned', 'In Progress']);

  const expiredStatus = await this.statusRepository.findOne({
    where: { name: 'Expired', type: 'inventory' },
  });

  if (!expiredStatus) {
    throw new BadRequestException(`Status "Expired" not found`);
  }

  for (const inventory of inProgressOrPlannedInventories) {
    const inventoryEnd = new Date(inventory.endDate);
    inventoryEnd.setHours(0, 0, 0, 0);

    if (inventoryEnd < today) {
      // Ajouter ligne status "Expired"
      const expiredEntry = this.inventoryStatusRepository.create({
        inventory,
        status: expiredStatus,
      });
      await this.inventoryStatusRepository.save(expiredEntry);

      // ➤ Optionnel : notifier admin ici
    }
  }
}

async updateEndDateAndRestoreInventory(id: string, newEndDate: Date) {
  const inventory = await this.inventoryRepository.findOne({ where: { id } });
  if (!inventory) throw new BadRequestException(`Inventory not found`);

  const lastStatus = await this.inventoryStatusRepository.findOne({
    where: { inventory: { id } },
    order: { createdAt: 'DESC' },
    relations: ['status'],
  });

  if (!lastStatus) {
    throw new BadRequestException(`No status found for inventory.`);
  }

  const now = new Date();

  if (lastStatus.status.name === 'Expired' && newEndDate > now) {
    inventory.endDate = newEndDate;
    await this.inventoryRepository.save(inventory);

    const inProgressStatus = await this.statusRepository.findOne({
      where: { name: 'In Progress', type: 'inventory' },
    });

    if (!inProgressStatus) {
      throw new BadRequestException(`Status "In Progress" not found`);
    }

    const newStatus = this.inventoryStatusRepository.create({
      inventory,
      status: inProgressStatus,
    });
    await this.inventoryStatusRepository.save(newStatus);

    return {
      message: `Inventory "${inventory.name}" endDate updated and status set to In Progress.`,
      inventoryId: inventory.id,
    };
  } else {
    throw new BadRequestException('Cannot restore inventory unless it is expired and new endDate is valid');
  }
}



  
}







   