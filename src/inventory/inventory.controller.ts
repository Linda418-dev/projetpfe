import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)  
@ApiTags('inventory Resource')
@Controller('Inventories')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Roles('admin') 
    @ApiOperation({ summary: 'Launch an inventory' })
    @Post('launch')
    async launchInventory(){
      return this.inventoryService.launchInventory();
    }
    @Roles('admin') 
    @ApiOperation({ summary: 'Close an inventory' })
    @Post('close')
    async closeInventory() {
      return this.inventoryService.closeInventory();
    }
}
