import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InventoryDetailsService } from './inventory-details.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';

@ApiTags('inventory-details Resource')
@Controller('inventory-details')
export class InventoryDetailsController {
    constructor(private readonly inventoryDetailsService: InventoryDetailsService) {}
  
    @Post()
    create(@Body() dto: CreateInventoryDetailsDto) {
     return this.inventoryDetailsService.create(dto);
    }

  

}
