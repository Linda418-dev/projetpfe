import { Controller, Get, Param } from '@nestjs/common';
import { AssetStatusService } from './asset-status.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('asset status Resource')
@Controller('asset-statuses')
export class AssetStatusController {
    constructor (private readonly assetStatusService : AssetStatusService){}

    @Get()
    @ApiOperation({ summary: 'Get all asset statuses' })
    getAll() {
      return this.assetStatusService.getAllHistoriesAssetStatus();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get asset status by ID' })
    getById(@Param('id') id: string) {
      return this.assetStatusService.getHistoryAssetStatusById(id);
    }

    @Get('/asset/:assetId')
    @ApiOperation({ summary: 'Get status history of an asset' })
    getHistoryByAssetId(@Param('assetId') assetId: string) {
      return this.assetStatusService.getHistoryByAssetId(assetId);
    }
      
}
