import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InventoryStatusService } from './inventory-status.service';

@ApiTags('Inventory Status Resource')
@Controller('inventory-status')
export class InventoryStatusController {
    constructor(private readonly inventoryStatusService : InventoryStatusService){}
    
    @Get()
    findAll() {
        return this.inventoryStatusService.findAll();
    }
    @Get('inventory/:id')
    findByInventory(@Param('id') inventoryId: string) {
    return this.inventoryStatusService.findByInventory(inventoryId);
  }
     
}
