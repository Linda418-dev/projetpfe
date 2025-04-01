import { Body, Controller, Param, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { UpdateInventoryDto } from './types/dto/update-inventory.dto';

@ApiTags('inventory Resource')
@Controller('Inventories')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @ApiOperation({ summary: 'Launch an inventory' })
    @Post('launch')
    async launchInventory(){
      return this.inventoryService.launchInventory();
    }
  
    @ApiOperation({ summary: 'Close an inventory' })
    @Post('close')
    async closeInventory() {
      return this.inventoryService.closeInventory();
    }
}
