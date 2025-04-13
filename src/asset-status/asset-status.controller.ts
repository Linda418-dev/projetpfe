import { Controller, Get, Param } from '@nestjs/common';
import { AssetStatusService } from './asset-status.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('asset status Resource')
@Controller('asset-status')
export class AssetStatusController {
    constructor (private readonly assetStatusService : AssetStatusService){}

    @Get()
    getAll() {
      return this.assetStatusService.getAllHistoriesAssetStatus();
    }
  
    @Get(':id')
    getById(@Param('id') id: string) {
      return this.assetStatusService.getHistoryAssetStatusById(id);
    }

    @Get('/asset/:assetId')
    getHistoryByAssetId(@Param('assetId') assetId: string) {
      return this.assetStatusService.getHistoryByAssetId(assetId);
    }
      
}
