import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { HistoryAssetService } from './history-asset.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('histories asset Resource')
@Controller('histories-asset')
export class HistoryAssetController {
     constructor(private readonly historyAssetService: HistoryAssetService) {}
    
        @Get()
        async getAllHistoryAssets() {
          return this.historyAssetService.getAllHistoryAssets();
        }
        @Get(':id') 
        async getHistoryByAssetId(@Param('id',new ParseUUIDPipe()) assetId: string) {
            return this.historyAssetService.getHistoryByAssetId(assetId);
        }
}
