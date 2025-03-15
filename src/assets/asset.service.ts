import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { validate as isUUID } from 'uuid';
@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository,
        private fileRepository:FileRepository,
        private readonly categoryRepository : CategoryRepository
    ) {}
    
    async createAsset(createAssetDto: CreateAssetDto) {
        const { name, fileId, categoryId } = createAssetDto;
    
        if (!isUUID(fileId) || !isUUID(categoryId)) {
            throw new BadRequestException('Invalid UUID for file or category');
        }
    
        // Vérifie si la catégorie existe
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
    
        // Créer l'asset avec la catégorie associée
        const asset = this.assetRepository.create({
            name,
            category,  // Associe l'objet catégorie
        });
    
        // Récupérer et associer le fichier
        const file = await this.fileRepository.findOne({ where: { id: fileId } });
        if (!file) {
            throw new NotFoundException('File not found');
        }
    
        asset.imageUrl = file.urlFile;
        file.asset = asset;
    
        // Sauvegarder l'asset et le fichier
        await this.assetRepository.save(asset);
        await this.fileRepository.save(file);
    
        return asset;
    }
    
      
    async getAllAssets() {
        const assets = await this.assetRepository.find({ relations: ['category'] });  // Charger la relation category
        console.log('📢 Assets récupérés:', assets);
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
}

    /*@Injectable()
    export class AssetService {
        constructor(
            private readonly assetRepository: AssetRepository,
            private readonly categoryService: CategoryService,
            private readonly supplierService: SupplierService,
            private readonly placeService: PlacesService
        ) {}
        async getAllAssets() {
            const assets = await this.assetRepository.find({
                relations: ['category', 'supplier', 'place'],
            });
        
            console.log('🔍 Assets bruts avant transformation:', assets);
        
            const formattedAssets = assets.map(asset => ({
                id: asset.id,
                name: asset.name,
                category: asset.category ? asset.category.name : 'Non classé',
                supplier: asset.supplier ? asset.supplier.name : 'Non défini',
                placeName: asset.place ? asset.place.name : 'Non défini',  // Utilise bien le 'placeName'
                createdAt: asset.createdAt,
                updatedAt: asset.updatedAt,
            }));
        
            console.log('✅ Assets renvoyés après transformation:', formattedAssets);
            return formattedAssets;
        }
        async getAssetById(id: string): Promise<Asset> {
        const asset = await this.assetRepository.findOne({ 
            where: { id }, 
            relations: ['category', 'supplier', 'place'] 
        });

        if (!asset) {
            throw new NotFoundException(`Asset with id ${id} not found`);
        }

        return asset;
    }
    async createAsset(createAssetDto: CreateAssetDto) {
        console.log('Données reçues du front:', createAssetDto);
    
        const { name, categoryId, supplierId, placeId } = createAssetDto;
    
        const category = await this.categoryService.getCategoryById(categoryId);
        if (!category) {
            throw new NotFoundException(`La catégorie avec l'ID ${categoryId} n'existe pas.`);
        }
    
        const supplier = supplierId ? await this.supplierService.getSupplierById(supplierId) : null;
        const place = placeId ? await this.placeService.getPlaceById(placeId) : null; // Assure-toi que placeId est bien passé
    
        const newAsset = this.assetRepository.create({
            name,
            category,
            supplier,
            place, // L'ajout direct de l'objet 'place' ici
            placeName: place ? place.name : '',  // Toujours stocker correctement le nom du lieu
        });
    
        const savedAsset = await this.assetRepository.save(newAsset);
    
        console.log('Nouvel asset créé:', savedAsset);
    
        return savedAsset;
    }
    
    
    
    async updateAsset(id: string, updateAssetDto: updateAssetDto) {
        const asset = await this.assetRepository.findOne({ where: { id }, relations: ['category', 'supplier', 'place'] });
        if (!asset) {
            throw new BadRequestException(`Asset with id ${id} not found`);
        }

        if (updateAssetDto.categoryId) {
            const category = await this.categoryService.getCategoryById(updateAssetDto.categoryId);
            if (!category) {
                throw new NotFoundException(`La catégorie avec l'ID ${updateAssetDto.categoryId} n'existe pas.`);
            }
            asset.category = category;
        }

        if (updateAssetDto.supplierId) {
            const supplier = await this.supplierService.getSupplierById(updateAssetDto.supplierId);
            if (!supplier) {
                throw new NotFoundException(`Le fournisseur avec l'ID ${updateAssetDto.supplierId} n'existe pas.`);
            }
            asset.supplier = supplier;
        }

        if (updateAssetDto.placeId) {
            const place = await this.placeService.getPlaceById(updateAssetDto.placeId);
            if (!place) {
                throw new NotFoundException(`Le lieu avec l'ID ${updateAssetDto.placeId} n'existe pas.`);
            }
            asset.place = place;
            asset.placeName = place.name; // 🔥 Mise à jour correcte
        }

        Object.assign(asset, updateAssetDto);

        return await this.assetRepository.save(asset);
    }
*/
   

