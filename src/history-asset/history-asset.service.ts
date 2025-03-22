import { Injectable } from '@nestjs/common';
import { HistoryAssetRepository } from './repositories/history-asset.repository';

@Injectable()
export class HistoryAssetService {
     constructor(
            private readonly historyAssetRepository: HistoryAssetRepository,
          ) {}
        
          async getAllHistoryAssets(){
            return this.historyAssetRepository.find();
          }
}
