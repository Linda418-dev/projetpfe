import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { BypassInventoryLock } from './guards/bypass-inventory-lock.decorator';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { Request } from 'express';
import { UpdateInventoryDto } from './types/dto/update-inventory.dto';

// @ApiBearerAuth() 
@ApiTags('inventory Resource')
@Controller('Inventories')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}
    @Roles('admin', 'operator')  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
  async findAll(){
    return this.inventoryService.getAllInventories();
  }
    
    @BypassInventoryLock() 
    /*@Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)*/
    @ApiOperation({ summary: 'Create a new inventory' })
    @Post('create')
    async createInventory(@Body() createInventoryDto: CreateInventoryDto) {
        return this.inventoryService.createInventory(createInventoryDto);
    }

    @Patch(':id/launch')
    async launchInventory(@Param('id') id: string) {
    return this.inventoryService.launchInventory(id);
   }
  /* @Patch(':id')
   async updateInventory(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
     return this.inventoryService.updateInventory(id, dto);
   }*/
   @Delete(':id')
   async deleteInventory(@Param('id') id: string) {
     return this.inventoryService.deleteInventory(id);
   }
  
   
   
}
