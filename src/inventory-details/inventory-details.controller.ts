import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { InventoryDetailsService } from './inventory-details.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';
import { UpdateInventoryDetailsDto } from './types/dto/update-Inventory-details.dto';


@ApiTags('inventory-details Resource')
@Controller('inventory-details')
export class InventoryDetailsController {
    constructor(private readonly inventoryDetailsService: InventoryDetailsService
    ) {}
  
    @Get()
    getAllInventoryDetails() {
      return this.inventoryDetailsService.getAllInventoryDetails();
    }

    @Post()
    createInventorydetails(@Body() dto: CreateInventoryDetailsDto) {
     return this.inventoryDetailsService.createInventorydetails(dto);
    }
    
    @Get(':id')
    getInventorydetailsById(@Param('id') id: string) {
      return this.inventoryDetailsService.getInventorydetailsById(id);
    }

    @Get('/by-inventory/:inventoryId')
    getInventoryDetailsByInventoryId(@Param('inventoryId') inventoryId: string) {
      return this.inventoryDetailsService.getInventoryDetailsByInventoryId(inventoryId);
    }
    @Patch(':id')
    async updateInventoryDetailsById(
      @Param('id') inventoryDetailsId: string,
      @Body() dto: UpdateInventoryDetailsDto,) {
        return this.inventoryDetailsService.updateInventoryDetailsById(inventoryDetailsId, dto);
      }






    

    
}
