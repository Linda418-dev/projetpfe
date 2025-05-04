import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { Asset } from './Entities/Asset.entity';
import { PaginateSearchDto } from './types/dto/paginate-search.dto';
import { LocationRepository } from 'src/location/repositories/location.repository';
import { File } from 'src/uploads/entities/file.entity';
import { LocationHistory } from 'src/location-history/entities/location-history.entity';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { AssetStatus } from 'src/asset-status/entities/asset-status.entity';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { AssetStatusEnum } from 'src/status/types/enums/asset-status.enum';
@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository,
        private fileRepository:FileRepository,
        private readonly categoryRepository : CategoryRepository,
        private readonly supplierRepository:SupplierRepository,
        private readonly locationRepository : LocationRepository,
        private readonly locationHistoryRepository : LocationHistoryRepository,
        private readonly assetStatusRepository : AssetStatusRepository,
        private readonly statusRepository : StatusRepository
    
       
    ) {}
        
    async getAssets(params: PaginateSearchDto) {
      const [assets, total] = await this.assetRepository.getAllAssetWithPaginate(params);
      return {
        data: assets,
        total,
        skip: params.skip ,
        take: params.take ,
      };
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
      const asset = await this.getAssetById(id);
      await this.assetRepository.remove(asset);
      return { message: 'Asset deleted successfully' };
  }
  
    async updateAsset(id: string, updateAssetDto: updateAssetDto) {
      const fetchAsset = await this.getAssetById(id);
      if (!fetchAsset) {
        throw new BadRequestException(`Asset with id ${id} not found`);
      }
    
      if (updateAssetDto.locationId && fetchAsset.location.id !== updateAssetDto.locationId) {
        const newLocation = await this.locationRepository.findOne({
          where: { id: updateAssetDto.locationId },
        });
    
        if (!newLocation) {
          throw new BadRequestException(`Location with id ${updateAssetDto.locationId} not found`);
        }
    
        const history = this.locationHistoryRepository.create({
          asset: fetchAsset,
          location: newLocation,
        });
        await this.locationHistoryRepository.save(history);
        fetchAsset.location = newLocation;
      }

      if (updateAssetDto.statusId && fetchAsset.status?.id !== updateAssetDto.statusId) {
        const newStatus = await this.statusRepository.findOne({
          where: { id: updateAssetDto.statusId },
        });
    
        if (!newStatus) {
          throw new BadRequestException(`Status with id ${updateAssetDto.statusId} not found`);
        }
    
        fetchAsset.status = newStatus;
    
        const assetStatus = this.assetStatusRepository.create({
          asset: fetchAsset,
          status: newStatus,
        });
        await this.assetStatusRepository.save(assetStatus);
      }
    
    // Update Category
    if (updateAssetDto.categoryId && fetchAsset.category?.id !== updateAssetDto.categoryId) {
    const newCategory = await this.categoryRepository.findOne({
      where: { id: updateAssetDto.categoryId },
    });

    if (!newCategory) {
      throw new BadRequestException(`Category with id ${updateAssetDto.categoryId} not found`);
    }

    fetchAsset.category = newCategory;
    }

   if (updateAssetDto.supplierId && fetchAsset.supplier?.id !== updateAssetDto.supplierId) {
    const newSupplier = await this.supplierRepository.findOne({
      where: { id: updateAssetDto.supplierId },
    });
  
    if (!newSupplier) {
      throw new BadRequestException(`Supplier with id ${updateAssetDto.supplierId} not found`);
    }
  
    fetchAsset.supplier = newSupplier;
  }

  if (updateAssetDto.name) {
    fetchAsset.name = updateAssetDto.name;
  }

  return this.assetRepository.save(fetchAsset);

    }
    
  async createAssetAndAssignToFile(createAssetDto: CreateAssetDto) {
    const { name, categoryId, supplierId, fileIds, locationId } = createAssetDto;
  
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) throw new Error('Category not found');
  
    const supplier = await this.supplierRepository.findOne({ where: { id: supplierId } });
    if (!supplier) throw new Error('Supplier not found');
  
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
      relations: ['service'],
    });
    if (!location) throw new Error('Location not found');
  
    let files: File[] = [];
    if (fileIds?.length) {
      files = await this.fileRepository.findByIds(fileIds);
      const foundIds = files.map((f) => f.id);
      const missingIds = fileIds.filter((id) => !foundIds.includes(id));
  
      if (missingIds.length > 0) {
        throw new Error(`Files not found for IDs: ${missingIds.join(', ')}`);
      }
    }
  
    
    const defaultStatus = await this.statusRepository.findOne({
      where: { name: AssetStatusEnum.GOOD, type: 'asset' },
    });
    if (!defaultStatus) throw new Error('Default status "Good" not found');
  
    const asset = new Asset();
    asset.name = name;
    asset.category = category;
    asset.supplier = supplier;
    asset.location = location;
    asset.status = defaultStatus; 
  
    const savedAsset = await this.assetRepository.save(asset);
  
    
    const locationHistory = new LocationHistory();
    locationHistory.asset = savedAsset;
    locationHistory.location = location;
    await this.locationHistoryRepository.save(locationHistory);
  
  
    const assetStatus = new AssetStatus();
    assetStatus.asset = savedAsset;
    assetStatus.status = defaultStatus;
    await this.assetStatusRepository.save(assetStatus);
  
   
    if (files.length > 0) {
      for (const file of files) {
        file.asset = savedAsset;
      }
      await this.fileRepository.save(files);
    }
  
    return savedAsset;
  }
   
  async getHistoryAssetById(assetId: string) {
    // 1. Récupérer l'asset actuel avec sa localisation et son statut
    const asset = await this.assetRepository.findOne({
      where: { id: assetId },
      relations: ['location', 'status'],
    });
  
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
  
    console.log('Asset trouvé:', asset); // Log de l'asset récupéré
  
    // 2. Récupérer l'historique de localisation
    const locationEvents = await this.locationHistoryRepository
      .createQueryBuilder('lh')
      .leftJoin('lh.location', 'location')
      .where('lh.assetId = :assetId', { assetId })
      .orderBy('lh.createdAt', 'ASC')
      .select([
        'lh.createdAt AS date',
        `'location' AS type`,
        'location.name AS value',
      ])
      .getRawMany();
  
    console.log('Événements de localisation:', locationEvents); // Log des événements de localisation
  
    // 3. Récupérer l'historique de statut
    const statusEvents = await this.assetStatusRepository
      .createQueryBuilder('astatus')
      .leftJoin('astatus.status', 'status')
      .where('astatus.assetId = :assetId', { assetId })
      .orderBy('astatus.createdAt', 'ASC')
      .select([
        'astatus.createdAt AS date',
        `'status' AS type`,
        'status.name AS value',
      ])
      .getRawMany();
  
    console.log('Événements de statut:', statusEvents); // Log des événements de statut
  
    // 4. Fusionner les événements
    const allEvents: {
      date: Date;
      type: 'location' | 'status';
      value: string;
    }[] = [...locationEvents, ...statusEvents];
  
    // 5. Trier les événements par date avant le regroupement
    allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    // 6. Grouper les événements par date exacte arrondie à la seconde
    const groupedMap = new Map<string, { date: Date; values: { location?: string; status?: string } }>();
  
    for (const event of allEvents) {
      // Arrondir la date à la seconde (supprimer les millisecondes)
      const dateKey = new Date(event.date).setMilliseconds(0);
      const group = groupedMap.get(dateKey.toString());
  
      if (group) {
        // Mettre à jour les valeurs si elles changent
        group.values[event.type] = event.value;
      } else {
        groupedMap.set(dateKey.toString(), {
          date: new Date(dateKey),
          values: { [event.type]: event.value },
        });
      }
    }
  
    // 7. Créer la timeline finale en respectant l'ordre chronologique
    const timeline: {
      asset: string;
      assetId: string;
      location: string;
      locationId: string;
      status: string;
      statusId: string;
      date: Date;
    }[] = [];
      
    // Valeurs initiales
    let currentLocation = asset.location.name;
    let currentStatus = asset.status.name;
  
    // 8. Ajouter les événements à la timeline en respectant l'ordre
    for (const group of groupedMap.values()) {
      // Si l'emplacement ou le statut a changé, les ajouter à la timeline
      if (group.values.location) currentLocation = group.values.location;
      if (group.values.status) currentStatus = group.values.status;
  
      timeline.push({
        asset: asset.name,
        assetId: asset.id,
        location: currentLocation,
        locationId: asset.location.id, // Ajout de l'ID
        status: currentStatus,
        statusId: asset.status.id,     // Ajout de l'ID
        date: group.date,
      });
      
    }
  
    console.log('Timeline finale:', timeline); // Log de la timeline
  
    return timeline;
  }
  
  
}

    