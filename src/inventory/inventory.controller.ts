import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { UpdateInventoryDto } from './types/dto/update-inventory.dto';


@ApiTags('inventory Resource')
@Controller('Inventories')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}
     @Post()
     async create(@Body() dto: CreateInventoryDto) {
      return this.inventoryService.createInventory(dto);
  }
     @Patch(':id/launch')
     async launch(@Param('id') id: string) {
      return this.inventoryService.launchInventory(id);
  }

     @Delete(':id')
     async delete(@Param('id') id: string) {
      return this.inventoryService.deleteInventory(id);
    }

    

    @Patch(':id')
async update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
  return this.inventoryService.updateInventory(id, dto);
}



}
