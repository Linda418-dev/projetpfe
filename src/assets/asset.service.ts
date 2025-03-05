import { BadRequestException, Injectable } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/CreateAsset.dto';
import { updateAssetDto } from './types/dto/UpdateAsset.dto';

@Injectable()
export class AssetService {
    constructor(private readonly assetRepository: AssetRepository){}
    
        async getAllAssets() {
            return this.assetRepository.find();
        }
        async getAssetById(id: string) {
           const fetchAsset= await this.assetRepository.findOneBy({id : id });
           if (!fetchAsset){
            throw new BadRequestException('Asset with id ${id} not found');
           }
           return fetchAsset;
        }
    
        async  CreateAsset(createAssetDto: CreateAssetDto) {
            return this.assetRepository.save(
                this.assetRepository.create(createAssetDto)
            )
        }
    
        async deleteAsset(id: string) {
           const fetchAsset = await this.getAssetById(id);
           return this.assetRepository.remove(fetchAsset);
        }
        async  updateAsset(id: string, updateAssetDto: updateAssetDto) {
            const fetchAsset = await this.getAssetById(id);
            if (!fetchAsset) {
                throw new BadRequestException(`Asset with id ${id} not found`);
            }
            Object.assign(fetchAsset, updateAssetDto);
            return this.assetRepository.save(fetchAsset);
        }
      
       
       
    
}
