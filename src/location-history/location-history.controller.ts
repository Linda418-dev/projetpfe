import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationHistoryService } from './location-history.service';

@ApiTags('Location History Resource ')
@Controller('location-histories')
export class LocationHistoryController {
    constructor (private readonly locationHistoryService : LocationHistoryService){}

    @Get()
    @ApiOperation({ summary: 'Get all location histories' })
    async getAllHistories() {
      return this.locationHistoryService.getAllHistories();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get location history for an asset by assetId' })
    async getHistoryByAssetId(@Param('id') id: string) {
      return this.locationHistoryService.getHistoryByAssetId(id);
    }
}
