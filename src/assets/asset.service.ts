import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { CategoryService } from 'src/category/category.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { Asset } from './Entities/Asset.entity';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { PlacesService } from 'src/places/places.service';

@Injectable()
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

    async deleteAsset(id: string) {
        const asset = await this.assetRepository.findOne({ where: { id } });
        if (!asset) {
            throw new NotFoundException(`Asset with id ${id} not found`);
        }

        return await this.assetRepository.remove(asset);
    }
}
