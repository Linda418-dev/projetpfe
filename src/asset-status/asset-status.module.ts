import { Module } from '@nestjs/common';
import { AssetStatusService } from './asset-status.service';
import { AssetStatusController } from './asset-status.controller';
import { AssetStatusRepository } from './repositories/asset-status.repository';

@Module({
  providers: [AssetStatusService,AssetStatusRepository],
  controllers: [AssetStatusController]
})
export class AssetStatusModule {}
