import { Injectable, NotFoundException } from '@nestjs/common';
import { HistoryAssetRepository } from './repositories/history-asset.repository';

@Injectable()
export class HistoryAssetService {
     constructor(
            private readonly historyAssetRepository: HistoryAssetRepository,
          ) {}
        
          async getAllHistoryAssets() {
            const histories = await this.historyAssetRepository.find({
                relations: ['asset', 'service'],
            });
        
            return histories.map(history => ({
                id: history.id,
                assetId: history.asset?.id,  
                serviceId: history.service?.id, 
                createdAt: history.createdAt,
                updatedAt: history.updatedAt,
            }));
        }
        async getHistoryByAssetId(assetId: string) {
            const histories = await this.historyAssetRepository.find({
                where: { asset: { id: assetId } },
                relations: ['asset', 'service'],
            });
            return histories.map(history => ({
                id: history.id,
                assetId: history.asset?.id,
                assetName: history.asset?.name,
                serviceId: history.service?.id,
                serviceName: history.service?.name,  
                createdAt: history.createdAt,
                updatedAt: history.updatedAt,
            }));
        }
}
