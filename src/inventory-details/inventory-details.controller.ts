import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InventoryDetailsService } from './inventory-details.service';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('inventory-details Resource')
@Controller('inventory-details')
export class InventoryDetailsController {
    constructor(private readonly inventoryDetailsService: InventoryDetailsService) {}
  

   /* @Post()
async createInventoryDetails(@Body() dto: CreateInventoryDetailsDto) {
  return this.inventoryDetailsService.createInventoryDetails(dto);
}

    @Get()
    async getAllInventoryDetails() {
      return this.inventoryDetailsService.getAllInventoryDetails();
    }
  
    @Get(':id')
    async getInventoryDetailsById(@Param('id') id: string) {
      return this.inventoryDetailsService.getInventoryDetailsById(id);
    }*/
}
