import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { ILike } from 'typeorm';
import { AssignFileToAssetDto } from 'src/uploads/types/dto/assign-file.dto';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { PlaceRepository } from 'src/places/Repositories/Place.repository';
import { Asset } from './Entities/Asset.entity';
import { HistoriqueLocationAsset } from 'src/historique-location-asset/entities/historique-location-asset.entity';
import { HistoriqueLocationAssetRepository } from 'src/historique-location-asset/repositories/histprique-location-asset.repository';
import { PaginationService } from 'src/pagination/pagination.service';
@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository,
        private fileRepository:FileRepository,
        private readonly categoryRepository : CategoryRepository,
        private readonly supplierRepository:SupplierRepository,
        private readonly placeRepository:PlaceRepository,
        private readonly historiqueLocationAssetRepository : HistoriqueLocationAssetRepository,
        private readonly paginationService:PaginationService,
    ) {}
         
 

    async getAllAssets(page:number=1,limit:number=4) {
        return this.paginationService.paginate(this.assetRepository,page,limit);
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
//declarer here
async createAssetAndAssignToFile(dto: AssignFileToAssetDto) {
    const { assetName, categoryName, supplierName, fileId, locationName } = dto;

    const category = await this.categoryRepository.findOne({ where: { name: categoryName }, relations: ['assets'] });
    if (!category) throw new Error('Category not found');
    
    const supplier = await this.supplierRepository.findOne({ where: { name: supplierName }, relations: ['assets'] });
    if (!supplier) throw new Error('Supplier not found');

    let place = await this.placeRepository.findOne({ where: { name: locationName }, relations: ['assets'] });
    if (!place) throw new Error('Place not found');

    const asset = new Asset();
    asset.name = assetName;
    asset.category = category;
    asset.categoryName = category.name;
    asset.supplier = supplier;
    asset.supplierName = supplier.name;
    asset.locationName = place.name;

    await this.assetRepository.save(asset);

    const file = await this.fileRepository.findOne({ where: { id: fileId } });
    if (!file) throw new Error('File not found');

    file.asset = asset;
    file.assetId = asset.id;
    asset.imageUrl = file.urlFile;

    await this.fileRepository.save(file);
    await this.assetRepository.save(asset);

    place.assetsNames = [...(place.assetsNames || []), asset.name];
    await this.placeRepository.save(place);

    const historique = new HistoriqueLocationAsset();
    historique.asset = asset;
    historique.assetId = asset.id;
    historique.assetName = asset.name;
    historique.locationId = place.id;
    historique.locationName = place.name;
    
    await this.historiqueLocationAssetRepository.save(historique);

    return asset;
}

}

    