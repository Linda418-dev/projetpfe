import { Controller, Get, Res } from '@nestjs/common';
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
        // récupère tous les assets 
        const assets = await this.assetRepository.find();
        const buffer = await this.excelService.exportAssetsToExcel(assets);
        res.set({
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // informer le navigateur qu'il sagit d'un fichier excel
          'Content-Disposition': 'attachment; filename=assets.xlsx', // le navigateur doit téléchager le fichier excel avec un nom 
        });
        // envoyer le fichier Excel au client 
        res.send(buffer);
      }
}
