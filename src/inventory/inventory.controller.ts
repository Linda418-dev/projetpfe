import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateInventoryDto } from './types/dto/create-inventory.dto';
import { UpdateInventoryDto } from './types/dto/update-inventory.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { BypassInventoryLock } from './guards/bypass-inventory-lock.decorator';

@ApiBearerAuth()
@ApiTags('inventory Resource')
@Controller('Inventories')

export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Req() req: Request) {
      const user = req.user;
      return this.inventoryService.getAllInventories(user);
    }

    @Get('site/:siteId')
  async getInventoriesBySite(@Param('siteId') siteId: string) {
    return this.inventoryService.getInventoriesBySite(siteId);
  }
    @BypassInventoryLock()
     @Post()
     async create(@Body() dto: CreateInventoryDto) {
      return this.inventoryService.createInventory(dto);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
    return this.inventoryService.getInventoryById(id);
   }

     @Patch(':id/launch')
     async launch(@Param('id') id: string) {
      return this.inventoryService.launchInventory(id);
  }


    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.updateInventory(id, dto);
  }





}
