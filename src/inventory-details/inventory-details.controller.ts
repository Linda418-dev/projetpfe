import { Body, Controller, Get, Param, Post, Res  } from '@nestjs/common';
import { InventoryDetailsService } from './inventory-details.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';


@ApiTags('inventory-details Resource')
@Controller('inventory-details')
export class InventoryDetailsController {
    constructor(private readonly inventoryDetailsService: InventoryDetailsService) {}
  
    @Get()
    getAllInventoryDetails() {
      return this.inventoryDetailsService. getAllInventoryDetails();
    }

    @Post()
    createInventorydetails(@Body() dto: CreateInventoryDetailsDto) {
     return this.inventoryDetailsService.createInventorydetails(dto);
    }
    
    @Get(':id')
    getInventorydetailsById(@Param('id') id: string) {
      return this.inventoryDetailsService. getInventorydetailsById(id);
    }

    @Get('/by-inventory/:inventoryId')
    getInventoryDetailsByInventoryId(@Param('inventoryId') inventoryId: string) {
      return this.inventoryDetailsService.getInventoryDetailsByInventoryId(inventoryId);
    }

    
}
