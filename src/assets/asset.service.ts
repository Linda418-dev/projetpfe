import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { ILike } from 'typeorm';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { Asset } from './Entities/Asset.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { ServiceRepository } from 'src/service/repositories/service.repository';
import { HistoryAssetRepository } from 'src/history-asset/repositories/history-asset.repository';
import { HistoryAsset } from 'src/history-asset/entities/history-Asset.entity';
import { PaginateSearchDto } from './types/dto/paginate-search.dto';
@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository,
        private fileRepository:FileRepository,
        private readonly categoryRepository : CategoryRepository,
        private readonly supplierRepository:SupplierRepository,
        private readonly paginationService:PaginationService,
        private readonly serviceRepository: ServiceRepository,
        private readonly historyAssetRepository :HistoryAssetRepository,
    
       
    ) {}
        
    async getAllAssetsWithPagination(page:number=1,limit:number=4) {
        return this.paginationService.paginate(this.assetRepository,page,limit);
    }

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
    
        // Vérifier si le serviceId est mis à jour
        if (updateAssetDto.serviceId && updateAssetDto.serviceId !== fetchAsset.serviceId) {
            const newService = await this.serviceRepository.findOne({ where: { id: updateAssetDto.serviceId } });
            if (!newService) {
                throw new BadRequestException(`Service with id ${updateAssetDto.serviceId} not found`);
            }
    
            // Créer un nouvel historique
            const historyAsset = new HistoryAsset();
            historyAsset.asset = fetchAsset;
            historyAsset.service = newService;
            await this.historyAssetRepository.save(historyAsset);
    
            // Mettre à jour l'Asset avec le nouveau serviceId
            fetchAsset.service = newService;
            fetchAsset.serviceId = newService.id;
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
                { service: { name: ILike(`%${keyword}%`) } }, // 🔹 Ajout de la recherche par service
            ],
            relations: ['category', 'supplier', 'service'], // 🔹 Ajout de la relation 'service'
        });
    
        return assets;
    }
    

async createAssetAndAssignToFile(createAssetdto: CreateAssetDto) {
    const { assetName, categoryName, supplierName, fileId, serviceId  } = createAssetdto;

    const category = await this.categoryRepository.findOne({ where: { name: categoryName }, relations: ['assets'] });
    if (!category) throw new Error('Category not found');
    
    const supplier = await this.supplierRepository.findOne({ where: { name: supplierName }, relations: ['assets'] });
    if (!supplier) throw new Error('Supplier not found');

    let service = await this.serviceRepository.findOne({ where: { id: createAssetdto.serviceId }, relations: ['assets'] });
    if (!service) throw new Error('Service not found');

    
   

    const asset = new Asset();
    asset.name = assetName;
    asset.category = category;
    asset.categoryName = category.name;
    asset.supplier = supplier;
    asset.supplierName = supplier.name;
    asset.service = service;  // Associer l'Asset au Service
    asset.serviceId = service.id;

    await this.assetRepository.save(asset);

    const file = await this.fileRepository.findOne({ where: { id: fileId } });
    if (!file) throw new Error('File not found');

    file.asset = asset;
    file.assetId = asset.id;
    asset.imageUrl = file.urlFile;

    await this.fileRepository.save(file);
    await this.assetRepository.save(asset);

    const historyAsset = new HistoryAsset();
    historyAsset.asset = asset;
    historyAsset.service = service;
    
    await this.historyAssetRepository.save(historyAsset);

    return asset;

    
}

}

    