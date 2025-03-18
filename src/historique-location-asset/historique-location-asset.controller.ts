import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HistoriqueLocationAssetService } from './historique-location-asset.service';
@ApiTags('Historique ressource')
@Controller('historique-location-asset')
export class HistoriqueLocationAssetController {


    
    constructor(private readonly historiqueService: HistoriqueLocationAssetService) {}


  @Get()
    async getHistorique() {
    return this.historiqueService.getHistorique();
    }
}
   