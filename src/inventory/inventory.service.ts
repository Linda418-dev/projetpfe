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


@Injectable()
export class InventoryService {
  constructor( private readonly inventoryRepository :InventoryRepository,
    private readonly statusRepository : StatusRepository,
    private readonly inventoryStatusRepository : InventoryStatusRepository,
    private readonly userRepository : userRepository,
    private readonly affectationRepository : AffectationRepository,
    private readonly siteRepository : SiteRepository
  ){}

  //  methode pour la creation d'un inventaire 
  async createInventory(createinventorydto: CreateInventoryDto) {
    //  le nom doit unique 
    const existing = await this.inventoryRepository.findOne({
      where: { name: createinventorydto.name },
    });
  
    if (existing) {
      throw new BadRequestException(`Inventory with name "${createinventorydto.name}" already exists`);
    }
  
    // verifier le siteId existe ou non 
    const site = await this.siteRepository.findOne({
      where: { id: createinventorydto.siteId },
    });
  
    if (!site) {
      throw new BadRequestException(`Site not found`);
    }
  
    let operators: User[] = [];
  
    // si "All" est coché ,charger tous les utilisateurs avec rôle "operator"
    if (createinventorydto.allOperators) {
      operators = await this.userRepository.findAllOperators();

      if (operators.length === 0) {
        throw new BadRequestException(`No operators found in the system.`);
      }
  
    //  sinon on vérifie les IDs envoyés
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
  
    const pendingStatus = await this.statusRepository.findOne({
      where: { name: 'Pending', type: 'inventory' },
    });
  
    if (!pendingStatus) {
      throw new BadRequestException(`Default inventory status "Pending" not found`);
    }
  
    const newStatus = this.inventoryStatusRepository.create({
      inventory: savedInventory,
      status: pendingStatus,
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


  
  //methode pour lancer inventaire par id 
  async launchInventory(id: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new BadRequestException(`Inventory not found`);
    }
  
    // verifier  le startDate  pour lancer
    const today = new Date();
    const startDate = new Date(inventory.startDate);
  
    // on ignore l'heure en ne comparant que la date
    const isBeforeStart = today.setHours(0, 0, 0, 0) < startDate.setHours(0, 0, 0, 0);
    if (isBeforeStart) {
      throw new BadRequestException(`Cannot launch inventory before its start date`);
    }
  
    // verifier que le statut "In Progress" existe ou non 
    const inProgressStatus = await this.statusRepository.findOne({
      where: { name: 'In Progress', type: 'inventory' },
    });
  
    if (!inProgressStatus) {
      throw new BadRequestException(`Status "In Progress" not found`);
    }
  
    // verifier  si déjà en cours ou non 
    const lastStatus = await this.inventoryStatusRepository.findOne({
      where: { inventory: { id } },
      order: { createdAt: 'DESC' },
      relations: ['status'],
    });
  
    if (lastStatus?.status.name === 'In Progress') {
      throw new BadRequestException(`Inventory is already in progress`);
    }
  
    // enregistrer nouvelle ligne dans inventory_status
    const newInventoryStatus = this.inventoryStatusRepository.create({
      inventory,
      status: inProgressStatus,
    });
  
    await this.inventoryStatusRepository.save(newInventoryStatus);
  
    return {
      message: `Inventory "${inventory.name}" has been launched.`,
      inventoryId: inventory.id,
      status: inProgressStatus.name,
    };
  }
  
  
}


   