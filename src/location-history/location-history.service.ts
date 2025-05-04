import { Injectable } from '@nestjs/common';
import { LocationHistoryRepository } from './repositories/location-history.repository';

@Injectable()
export class LocationHistoryService {
    constructor(private readonly locationHistoryRepository : LocationHistoryRepository){}
    
    async getAllHistories() {
        return this.locationHistoryRepository.find({
          relations: ['asset', 'location'],
          order: { createdAt: 'DESC' },
        });
      }

      async getHistoryByAssetId(assetId: string) {
        return this.locationHistoryRepository.find({
          where: { asset: { id: assetId } },
          relations: ['asset', 'location'],
          order: { createdAt: 'DESC' },
        });
      }
}
