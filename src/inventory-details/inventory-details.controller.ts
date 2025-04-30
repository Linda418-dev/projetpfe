import { Body, Controller, Delete, Get, Param, Post, Res  } from '@nestjs/common';
import { InventoryDetailsService } from './inventory-details.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateInventoryDetailsDto } from './types/dto/create-inventory.dto';
import { Response } from 'express';
import { BypassInventoryLock } from 'src/inventory/guards/bypass-inventory-lock.decorator';


@ApiTags('inventory-details Resource')
@Controller('inventory-details')
export class InventoryDetailsController {
    constructor(private readonly inventoryDetailsService: InventoryDetailsService) {}
  
    @Get()
    getAllInventoryDetails() {
      return this.inventoryDetailsService. getAllInventoryDetails();
    }
    @BypassInventoryLock()
    @Post()
    createInventorydetails(@Body() dto: CreateInventoryDetailsDto) {
     return this.inventoryDetailsService.createInventorydetails(dto);
    }
    
    @Get(':id')
    getInventorydetailsById(@Param('id') id: string) {
      return this.inventoryDetailsService. getInventorydetailsById(id);
    }
    
    @Get(':inventoryId/export')
    async exportInventory(@Param('inventoryId') inventoryId: string, @Res() res: Response) {
    return this.inventoryDetailsService.exportInventoryToExcel(inventoryId, res);
  }

  

}
