import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { AssetRepository } from './Repositories/Asset.repository';


@Module({
      controllers: [AssetController],
      providers: [AssetService , AssetRepository]
})

export class AssetModule {}
