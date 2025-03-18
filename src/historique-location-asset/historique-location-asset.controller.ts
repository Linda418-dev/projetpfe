import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HistoriqueLocationAssetService } from './historique-location-asset.service';
import { AssetsService } from 'src/assets/asset.service';


@ApiTags('History Resource')
@Controller('historiques')
export class HistoriqueLocationAssetController {


    
    constructor(private readonly historiqueLocationAssetService: HistoriqueLocationAssetService, 
    ) {}


  @Get()
    async getHistorique() {
    return this.historiqueLocationAssetService.getAllHistory();
    }
    @Get('asset/:assetId')
    async getHistoriqueByAssetId(
      @Param('assetId') assetId: string,
    ){
      return this.historiqueLocationAssetService.getHistoriqueByAssetId(assetId);
    }
  
    
    
}
   