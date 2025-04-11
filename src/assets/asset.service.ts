import { BadRequestException, Injectable } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { Asset } from './Entities/Asset.entity';
import { PaginateSearchDto } from './types/dto/paginate-search.dto';
@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository,
        private fileRepository:FileRepository,
        private readonly categoryRepository : CategoryRepository,
        private readonly supplierRepository:SupplierRepository,
    
       
    ) {}
        
    async getAssets(params:PaginateSearchDto){
        return this.assetRepository.getAllAssetWithPaginate(params);

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


    async createAssetAndAssignToFile(createAssetDto: CreateAssetDto) {
        const { name, categoryId, supplierId, fileIds } = createAssetDto;
      
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) throw new Error('Category not found');
      
        const supplier = await this.supplierRepository.findOne({ where: { id: supplierId } });
        if (!supplier) throw new Error('Supplier not found');
      
        const asset = new Asset();
        asset.name = name;
        asset.category = category;
        asset.supplier = supplier;
      
        const savedAsset = await this.assetRepository.save(asset);
        if (fileIds?.length) {
          const files = await this.fileRepository.findByIds(fileIds);
      
          const foundIds = files.map((f) => f.id);
          const missingIds = fileIds.filter(id => !foundIds.includes(id));
      
          if (missingIds.length > 0) {
            throw new Error(`Files not found for IDs: ${missingIds.join(', ')}`);
          }
      
          for (const file of files) {
            file.asset = savedAsset;
          }
      
          await this.fileRepository.save(files);
        }
      
        return savedAsset;
      }
      
}

    