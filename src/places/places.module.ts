import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PlaceRepository } from './Repositories/Place.repository';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService , PlaceRepository]
})
export class PlacesModule {}
