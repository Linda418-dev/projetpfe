import { Module } from '@nestjs/common';
import { HistoriqueLocationAssetService } from './historique-location-asset.service';
import { HistoriqueLocationAssetController } from './historique-location-asset.controller';
import { HistoriqueLocationAsset } from './entities/historique-location-asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueLocationAssetRepository } from './repositories/histprique-location-asset.repository';
import { AssetsService } from 'src/assets/asset.service';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { CategoryRepository } from 'src/category/Repositories/category.repository';


@Module({
  imports: [TypeOrmModule.forFeature([HistoriqueLocationAsset])],
  providers: [HistoriqueLocationAssetService,HistoriqueLocationAssetRepository,AssetsService,AssetRepository,FileRepository,CategoryRepository],
  controllers: [HistoriqueLocationAssetController],
  exports: [HistoriqueLocationAssetService]
})
export class HistoriqueLocationAssetModule {}
