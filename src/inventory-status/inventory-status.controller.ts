import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InventoryStatusService } from './inventory-status.service';

@ApiTags('Inventory Status Resource')
@Controller('inventory-status')
export class InventoryStatusController {
      constructor(private readonly inventoryStatusService : InventoryStatusService){}
    
       /* @Get(':id/status-history')
        async getInventoryStatusHistory(@Param('id') inventoryId: string) {
            return this.inventoryStatusService.getInventoryStatusHistory(inventoryId);
        }*/
    
        @Get('status-history/all')
        async getAllInventoryStatusHistories() {
            return this.inventoryStatusService.getAllInventoryStatusHistories();
        }
}
