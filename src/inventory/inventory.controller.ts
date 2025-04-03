import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { BypassInventoryLock } from './guards/bypass-inventory-lock.decorator';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { Request } from 'express';

@ApiBearerAuth() 

@ApiTags('inventory Resource')
@Controller('Inventories')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}
    @Roles('admin', 'operator')  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getInventories(@Req() req: Request) {
        console.log(req.user); 
        return this.inventoryService.getInventories(req.user);
    }
    
    
    @Roles('admin') 
    @UseGuards(JwtAuthGuard, RolesGuard) 
    @ApiOperation({ summary: 'Launch an inventory' })
    @Post('launch')
    async launchInventory(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.launchInventory(createInventoryDto.name, createInventoryDto.operatorIds);
}

   
    @BypassInventoryLock() 
    @ApiOperation({ summary: 'Close an inventory' })
    @Post('close')
    async closeInventory() {
      return this.inventoryService.closeInventory();
    }
}
