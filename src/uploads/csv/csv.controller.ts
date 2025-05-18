// src/uploads/csv/csv.controller.ts

import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { CsvService } from './csv.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('csv Resource')
@Controller('csv')
export class CsvController {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly csvService: CsvService
  ) {}

  @Get('assets/csv')
  async downloadAssetsCSV(@Res() res: Response) {
    const assets = await this.assetRepository.find({
      relations: ['category', 'supplier', 'location', 'status'],
    });

    const buffer = await this.csvService.exportAssetsToCSV(assets);

    const dateStr = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=assets-${dateStr}.csv`);

    res.send(buffer);
  }
  @Get('inventory/:id/csv')
  async downloadInventoryCSV(
    @Param('id') inventoryId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.csvService.exportInventoryDetailsToCSV(inventoryId);

    const dateStr = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-${inventoryId}-${dateStr}.csv`);
    res.send(buffer);
  }
}
