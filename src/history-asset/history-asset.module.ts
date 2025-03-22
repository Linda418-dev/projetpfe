import { Module } from '@nestjs/common';
import { HistoryAssetController } from './history-asset.controller';
import { HistoryAssetService } from './history-asset.service';
import { HistoryAssetRepository } from './repositories/history-asset.repository';

@Module({
  controllers: [HistoryAssetController],
  providers: [HistoryAssetService,HistoryAssetRepository]
})
export class HistoryAssetModule {}
