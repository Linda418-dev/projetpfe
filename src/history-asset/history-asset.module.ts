import { Module } from '@nestjs/common';
import { HistoryAssetController } from './history-asset.controller';
import { HistoryAssetService } from './history-asset.service';

@Module({
  controllers: [HistoryAssetController],
  providers: [HistoryAssetService]
})
export class HistoryAssetModule {}
