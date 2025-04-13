import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetStatusRepository } from './repositories/asset-status.repository';

@Injectable()
export class AssetStatusService {
    constructor (private readonly assetStatusRepository : AssetStatusRepository){}
    async getAllHistoriesAssetStatus() {
        return this.assetStatusRepository.find({ relations: ['asset', 'status'] });
      }
    
      async getHistoryAssetStatusById(id: string) {
        const assetStatus = await this.assetStatusRepository.findOne({
          where: { id },
          relations: ['asset', 'status'],
        });
    
        if (!assetStatus) {
          throw new NotFoundException(`AssetStatus with id ${id} not found`);
        }
    
        return assetStatus;
      }

      async getHistoryByAssetId(assetId: string) {
        return this.assetStatusRepository.find({
          where: { asset: { id: assetId } },
          relations: ['status', 'asset'],
          order: { createdAt: 'DESC' },
        });
      }
}
