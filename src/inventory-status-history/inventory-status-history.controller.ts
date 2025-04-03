import { Controller, Get, Param } from '@nestjs/common';
import { InventoryStatusHistoryService } from './inventory-status-history.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('InventoryStatusHistory Resource')
@Controller('inventory-status-history')
export class InventoryStatusHistoryController {
    constructor(private readonly inventoryStatusHistoryService : InventoryStatusHistoryService){}

    @Get(':id/status-history')
    async getInventoryStatusHistory(@Param('id') inventoryId: string) {
        return this.inventoryStatusHistoryService.getInventoryStatusHistory(inventoryId);
    }

    @Get('status-history/all')
    async getAllInventoryStatusHistories() {
        return this.inventoryStatusHistoryService.getAllInventoryStatusHistories();
    }
}
