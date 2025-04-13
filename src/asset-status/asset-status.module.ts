import { Module } from '@nestjs/common';
import { AssetStatusService } from './asset-status.service';
import { AssetStatusController } from './asset-status.controller';

@Module({
  providers: [AssetStatusService],
  controllers: [AssetStatusController]
})
export class AssetStatusModule {}
