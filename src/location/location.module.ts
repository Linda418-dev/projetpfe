import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepository } from './repositories/location.repository';
import { ServiceRepository } from 'src/service/repositories/service.repository';

@Module({
  providers: [LocationService,LocationRepository,ServiceRepository],
  controllers: [LocationController]
})
export class LocationModule {}
