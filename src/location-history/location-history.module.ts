import { Module } from '@nestjs/common';
import { LocationHistoryService } from './location-history.service';
import { LocationHistoryController } from './location-history.controller';
import { LocationHistoryRepository } from './repositories/location-history.repository';

@Module({
  providers: [LocationHistoryService ,LocationHistoryRepository],
  controllers: [LocationHistoryController]
})
export class LocationHistoryModule {}
