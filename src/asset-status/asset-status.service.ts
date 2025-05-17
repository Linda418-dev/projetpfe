import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetStatusRepository } from './repositories/asset-status.repository';

@Injectable()
export class AssetStatusService {
    constructor (private readonly assetStatusRepository : AssetStatusRepository){}

     // Récupérer  tous les historiques du status pour  des biens 
    async getAllHistoriesAssetStatus() {
        return this.assetStatusRepository.find({ relations: ['asset', 'status'] });
      }
    
      // Récupérer les historiques par id de  status 
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
      
      // Récupérer  les historiques du status par un assetid
      async getHistoryByAssetId(assetId: string) {
        return this.assetStatusRepository.find({
          where: { asset: { id: assetId } },
          relations: ['status', 'asset'],
          order: { createdAt: 'DESC' },
        });
      }
}
