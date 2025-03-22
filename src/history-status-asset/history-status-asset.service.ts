import { Injectable } from '@nestjs/common';
import { HistoryStatusAssetRepository } from './repositories/history-asset.repository';

@Injectable()
export class HistoryStatusAssetService {
    constructor(
        private readonly historyStatusAssetRepository: HistoryStatusAssetRepository,
      ) {}
    
      async getAllHistoryStatus(){
        return this.historyStatusAssetRepository.find();
      }
}
