import { Module } from '@nestjs/common';
import { HistoriqueLocationAssetService } from './historique-location-asset.service';
import { HistoriqueLocationAssetController } from './historique-location-asset.controller';
import { HistoriqueLocationAsset } from './entities/historique-location-asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueLocationAssetRepository } from './repositories/histprique-location-asset.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HistoriqueLocationAsset])],
  providers: [HistoriqueLocationAssetService,HistoriqueLocationAssetRepository],
  controllers: [HistoriqueLocationAssetController],
  exports: [HistoriqueLocationAssetService]
})
export class HistoriqueLocationAssetModule {}
