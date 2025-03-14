import { BadRequestException, Injectable } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';

@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository,
        private fileRepository:FileRepository,
    ) {}

    async createAsset(createAssetDto: CreateAssetDto) {
        const { name, fileId } = createAssetDto;
      
        const asset = this.assetRepository.create({ name });
        await this.assetRepository.save(asset);
      
        if (fileId) {
          const file = await this.fileRepository.findOne({ where: { id: fileId } });
          if (!file) {
            throw new Error(`File with ID ${fileId} not found`);
          }
          
          asset.imageUrl = file.urlFile; 
    
          file.asset = asset;  
        
          await this.assetRepository.save(asset); 
          await this.fileRepository.save(file);   
        }
      
        return asset;
    }
    
    
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
}
