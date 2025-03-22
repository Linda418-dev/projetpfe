import { Module } from '@nestjs/common';
import { HistoryStatusAssetController } from './history-status-asset.controller';
import { HistoryStatusAssetService } from './history-status-asset.service';
import { HistoryStatusAssetRepository } from './repositories/history-asset.repository';

@Module({
  controllers: [HistoryStatusAssetController],
  providers: [HistoryStatusAssetService,HistoryStatusAssetRepository]
})
export class HistoryStatusAssetModule {}
