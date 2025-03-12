import { BadRequestException, Injectable } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { updateAssetDto } from './types/dto/update-asset.dto';

@Injectable()
export class AssetService {
    constructor(private readonly assetRepository: AssetRepository) {}

    async getAllAssets() {
        return this.assetRepository.find();
    }

    async getAssetById(id: string) {
        const fetchAsset = await this.assetRepository.findOneBy({ id });
        if (!fetchAsset) {
            throw new BadRequestException(`Asset with id ${id} not found`);
        }
        return fetchAsset;
    }

  /*  async createAsset(createAssetDto: CreateAssetDto) {
        console.log('Données reçues:', createAssetDto); 
    
        if (!createAssetDto.imageUrl) {
            throw new BadRequestException('Image URL is required');
        }
    
        const asset = this.assetRepository.create({
            name: createAssetDto.name,
            imageUrl: createAssetDto.imageUrl, 
        });
    
        return this.assetRepository.save(asset);
    }*/
    
    
    async deleteAsset(id: string) {
        const fetchAsset = await this.getAssetById(id);
        return this.assetRepository.remove(fetchAsset);
    }
    async updateAsset(id: string, updateAssetDto: updateAssetDto) {
        const fetchAsset = await this.getAssetById(id);
        if (!fetchAsset) {
          throw new BadRequestException(`Asset with id ${id} not found`);
        }
      
        Object.assign(fetchAsset, updateAssetDto);
      
        return this.assetRepository.save(fetchAsset);
      }
      
}
