import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { ILike } from 'typeorm';
@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository,
        private fileRepository:FileRepository,
        private readonly categoryRepository : CategoryRepository
    ) {}
    
   
      
    async getAllAssets() {
        const assets = await this.assetRepository.find({ relations: ['category'] });  
        console.log(' Assets récupérés:', assets);
        return assets;
    }
    

    async getAssetById(id: string) {
        const fetchAsset = await this.assetRepository.findOneBy({ id });
        if (!fetchAsset) {
            throw new BadRequestException(`Asset with id ${id} not found`);
        }
        return fetchAsset;
    }

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
      
      async getFilesWithNames() {
        const files = await this.fileRepository.find(); 
    
        return files.map(file => ({
          id: file.id,     
          name: file.name,  
        }));
      }
   

async searchAssets(keyword: string) {
    if (!keyword) {
        throw new BadRequestException('Keyword is required for search.');
    }

    const assets = await this.assetRepository.find({
        where: [
            { name: ILike(`%${keyword}%`) },
            { category: { name: ILike(`%${keyword}%`) } },
            { supplier: { name: ILike(`%${keyword}%`) } },
            { locationName: ILike(`%${keyword}%`) }
        ],
        relations: ['category', 'supplier'], 
    });

    return assets;
}

}

    