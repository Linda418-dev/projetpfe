import { Controller, Get } from '@nestjs/common';
import { HistoryStatusAssetService } from './history-status-asset.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('histories status asset Resource')
@Controller('histories-status-asset')
export class HistoryStatusAssetController {
    constructor(private readonly historyStatusAssetService: HistoryStatusAssetService) {}

    @Get()
    async getAllHistoryStatus() {
      return this.historyStatusAssetService.getAllHistoryStatus();
    }
}
