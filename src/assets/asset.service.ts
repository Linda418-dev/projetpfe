import { BadRequestException, Injectable } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { updateAssetDto } from './types/dto/update-asset.dto';

@Injectable()
export class AssetService {
    constructor(private readonly assetRepository: AssetRepository) {}

    async  CreateAsset(createAssetDto: CreateAssetDto) {
            return this.assetRepository.save(
                this.assetRepository.create(createAssetDto)
            )
        }

    async getAllAssets() {
        return this.assetRepository.find();
    }

    async getAssetById(id: number) {
        const fetchAsset = await this.assetRepository.findOneBy({ id });
        if (!fetchAsset) {
            throw new BadRequestException(`Asset with id ${id} not found`);
        }
        return fetchAsset;
    }

    async deleteAsset(id: number) {
        const fetchAsset = await this.getAssetById(id);
        return this.assetRepository.remove(fetchAsset);
    }
    async updateAsset(id: number, updateAssetDto: updateAssetDto) {
        const fetchAsset = await this.getAssetById(id);
        if (!fetchAsset) {
          throw new BadRequestException(`Asset with id ${id} not found`);
        }
      
        Object.assign(fetchAsset, updateAssetDto);
      
        return this.assetRepository.save(fetchAsset);
      }
      
}
