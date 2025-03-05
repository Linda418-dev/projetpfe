import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PlaceRepository } from './Repositories/Place.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService , PlaceRepository , AssetRepository]
})
export class PlacesModule {}
