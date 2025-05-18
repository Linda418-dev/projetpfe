import { Controller, Get, Param, Res } from '@nestjs/common';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { ExcelService } from './excel.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('excel Resource')
@Controller('excels')
export class ExcelController {
    constructor(
        private readonly assetRepository: AssetRepository,
        private readonly excelService: ExcelService,
      ) {}
    
      
@Get('assets')
async downloadAssetsExcel(@Res() res: Response) {
  const assets = await this.assetRepository.find();
  const buffer = await this.excelService.exportAssetsToExcel(assets);

  // Obtenir la date système au format AAAA-MM-JJ
  const dateStr = new Date().toISOString().split('T')[0]; // exemple: '2025-05-18'
  // ou avec dayjs (si installé) : const dateStr = dayjs().format('YYYY-MM-DD');

  res.set({
    'Content-Type':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename=${dateStr}.xlsx`,
  });

  res.send(buffer);
}
  @Get('inventory/:id')
async exportInventory(
  @Param('id') inventoryId: string,
  @Res() res: Response,
) {
  const buffer = await this.excelService.exportInventoryDetailsByInventoryId(inventoryId);

  // Obtenir la date système au format AAAA-MM-JJ
  const dateStr = new Date().toISOString().split('T')[0];

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=inventory-${inventoryId}-${dateStr}.xlsx`,
  );

  res.end(buffer);
}

}
