import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { ILike } from 'typeorm';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { PlaceRepository } from 'src/places/Repositories/Place.repository';
import { Asset } from './Entities/Asset.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { ServiceRepository } from 'src/service/repositories/service.repository';
import { HistoryAssetRepository } from 'src/history-asset/repositories/history-asset.repository';
import { HistoryAsset } from 'src/history-asset/entities/history-Asset.entity';
import { AssetStatus } from './types/enums/asset-status.enum';
import { HistoryStatusAsset } from 'src/history-status-asset/entities/history-status-Asset.entity';
import { HistoryStatusAssetRepository } from 'src/history-status-asset/repositories/history-asset.repository';
@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository,
        private fileRepository:FileRepository,
        private readonly categoryRepository : CategoryRepository,
        private readonly supplierRepository:SupplierRepository,
        private readonly placeRepository:PlaceRepository,
        private readonly paginationService:PaginationService,
        private readonly serviceRepository: ServiceRepository,
        private readonly historyAssetRepository :HistoryAssetRepository,
        private readonly historyStatusAssetRepository :HistoryStatusAssetRepository
    ) {}
        
    async getAllAssetsWithPagination(page:number=1,limit:number=4) {
        return this.paginationService.paginate(this.assetRepository,page,limit);
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

        if (updateAssetDto.status && updateAssetDto.status !== fetchAsset.status) {
            const newHistoryStatus = new HistoryStatusAsset();
            newHistoryStatus.asset = fetchAsset;
            newHistoryStatus.assetId = fetchAsset.id;
            newHistoryStatus.status = updateAssetDto.status;
            await this.historyStatusAssetRepository.save(newHistoryStatus);
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
    const { assetName, categoryName, supplierName, fileId, serviceId ,status } = createAssetdto;

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
    asset.status = status || AssetStatus.GOOD_CONDITION;

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


    const historyStatus = new HistoryStatusAsset();
    historyStatus.asset = asset;
    historyStatus.assetId = asset.id;
    historyStatus.status = asset.status;

    await this.historyStatusAssetRepository.save(historyStatus);

    return asset;

    
}

}

    