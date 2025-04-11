import {  BadRequestException, Injectable } from '@nestjs/common';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';
import { InventoryDetailsRepository } from './repositories/inventory-details.repository';
import { InventoryRepository } from 'src/inventory/repositories/inventory.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { InventoryDetails } from './entities/inventory-details.entity';
import { StatusEnum } from 'src/status/types/enums/status.enum';

@Injectable()
export class InventoryDetailsService {
  constructor(
    private readonly inventoryDetailsRepository: InventoryDetailsRepository,
   private readonly inventoryRepository: InventoryRepository,
     private readonly assetRepository: AssetRepository,
  ) {}
  async createInventoryDetails(dto: CreateInventoryDetailsDto): Promise<InventoryDetails> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: dto.inventoryId },
      relations: ['status'], 
    });
  
    if (!inventory) {
      throw new BadRequestException('Inventory not found');
    }
  
    // 🔒 Vérification du statut
    if (inventory.status?.name !== StatusEnum.IN_PROGRESS) {
      throw new BadRequestException('Inventory is not in progress');
    }
  
    const asset = await this.assetRepository.findOneByOrFail({ id: dto.assetId });
  
    const inventoryDetails = this.inventoryDetailsRepository.create({
      inventory,
      status: dto.status,
      scannedAt: new Date(),
    });
  
    return await this.inventoryDetailsRepository.save(inventoryDetails);
  }
  
  
  async getAllInventoryDetails() {
    return await this.inventoryDetailsRepository.find({
      relations: ['inventory', 'asset', 'place'],
    });
  }

  async getInventoryDetailsById(id: string) {
    return await this.inventoryDetailsRepository.findOne({
      where: { id },
      relations: ['inventory', 'asset', 'place'],
    });
  }
}
