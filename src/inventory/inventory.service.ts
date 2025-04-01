import { Injectable } from '@nestjs/common';
import { InventoryRepository } from './repositories/inventory.repository';
import { Inventory } from './entities/inventory.entity';
import { IsNull } from 'typeorm'; // Import nécessaire pour chercher un `null`

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  async launchInventory() {
    const inventory = new Inventory();
    inventory.launchDate = new Date(); // Enregistre la date actuelle pour le lancement
    inventory.closingDate = null; // Autorisé maintenant
    return this.inventoryRepository.save(inventory);
  }

  async closeInventory() {
    // Trouver un inventaire en cours (où closingDate est NULL)
    const inventory = await this.inventoryRepository.findOne({
      where: { closingDate: IsNull() }, // Utilisation de IsNull() au lieu de { closingDate: null }
    });

    if (!inventory) {
      throw new Error('No active inventory found to close');
    }

    inventory.closingDate = new Date(); // Enregistre la date actuelle pour la fermeture
    return this.inventoryRepository.save(inventory);
  }
}
