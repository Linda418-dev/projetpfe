import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepository } from './Repositories/Asset.repository';
import { CreateAssetDto } from './types/dto/create-asset.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { Asset } from './Entities/asset.entity';
import { PaginateSearchDto } from './types/dto/paginate-search.dto';
import { LocationRepository } from 'src/location/repositories/location.repository';
import { File } from 'src/uploads/entities/file.entity';
import { LocationHistory } from 'src/location-history/entities/location-history.entity';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { AssetStatus } from 'src/asset-status/entities/asset-status.entity';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { AssetStatusEnum } from 'src/status/types/enums/asset-status.enum';
import { ICategory } from 'src/category/types/interface/category.interface';
import { ISupplier } from 'src/supplier/types/interfaces/Supplier.interface';
import { Ilocation } from 'src/location/types/interfaces/location.interface';
import { Istatus } from 'src/status/types/interfaces/status.interface';
import { In } from 'typeorm';
import * as QRCode from 'qrcode';
import { UserRoleEnum } from 'src/user-role/types/enums/user-role.enum';
import { User } from 'src/user/entities/user.entity';
import { userRepository } from 'src/user/repositories/user.repository';
import { IUserRole } from 'src/user-role/types/interface/user-role.interface';
import { AssetAssignmentRepository } from 'src/asset-assignment/repositories/asset-assignment.repository';
import { IUser } from 'src/user/types/interface/user.interface';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
@Injectable()
export class AssetsService {
    constructor(private readonly assetRepository: AssetRepository,
        private fileRepository:FileRepository,
        private readonly categoryRepository : CategoryRepository,
        private readonly supplierRepository:SupplierRepository,
        private readonly locationRepository : LocationRepository,
        private readonly locationHistoryRepository : LocationHistoryRepository,
        private readonly assetStatusRepository : AssetStatusRepository,
        private readonly statusRepository : StatusRepository,
        private readonly userRepository : userRepository,
        private readonly assetAssignmentRepository : AssetAssignmentRepository
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
    return this.assetRepository.findAllAssetsNotInRepair();
  }


  async getAssetsBySite(siteId: string) {
    return this.assetRepository.findBySite(siteId);
  }

  async getAssetById(id: string) {
    const fetchAsset = await this.assetRepository.findOneBy({ id });
    if (!fetchAsset) {
      throw new BadRequestException(`Asset with id ${id} not found`);
    }
    return fetchAsset;
    }

 async deleteAsset(id: string) {
  const asset = await this.assetRepository.findOne({
    where: { id },
    relations: ['locationHistory'],
  });

  if (!asset) {
    throw new NotFoundException('Asset not found');
  }

  await this.assetRepository.remove(asset);
  return { message: 'Asset deleted successfully' };
}

    
    async updateAsset(id: string, updateAssetDto: updateAssetDto) {
      const fetchAsset = await this.getAssetById(id);
      if (!fetchAsset) {
        throw new BadRequestException(`Asset with id ${id} not found`);
      }
    let category = fetchAsset.category as ICategory;
    let supplier = fetchAsset.supplier as ISupplier;
    let location = fetchAsset.location as Ilocation;
    let status = fetchAsset.status as Istatus;
      // Mise à jour de la localisation + historique
      if (updateAssetDto.locationId && location.id !== updateAssetDto.locationId) {
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
    
      // Mise à jour du statut + historique
      if (updateAssetDto.statusId && status.id !== updateAssetDto.statusId) {
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
    
      // Mise à jour de la catégorie
      if (updateAssetDto.categoryId && category.id !== updateAssetDto.categoryId) {
        const newCategory = await this.categoryRepository.findOne({
          where: { id: updateAssetDto.categoryId },
        });
    
        if (!newCategory) {
          throw new BadRequestException(`Category with id ${updateAssetDto.categoryId} not found`);
        }
    
        fetchAsset.category = newCategory;
      }
      
      // Mise à jour du fournisseur
      if (updateAssetDto.supplierId && supplier?.id !== updateAssetDto.supplierId) {
        const newSupplier = await this.supplierRepository.findOne({
          where: { id: updateAssetDto.supplierId },
        });
    
        if (!newSupplier) {
          throw new BadRequestException(`Supplier with id ${updateAssetDto.supplierId} not found`);
        }
    
        fetchAsset.supplier = newSupplier;
      }
    
      // Mise à jour du nom
      if (updateAssetDto.name) {
        fetchAsset.name = updateAssetDto.name;
      }

      if (updateAssetDto.fileIds && updateAssetDto.fileIds.length > 0) {
     // Vérifie si tous les fichiers existent
       const relatedFiles = await this.fileRepository.find({
        where: { id: In(updateAssetDto.fileIds) },
      });
      if (relatedFiles.length !== updateAssetDto.fileIds.length) {
        const foundIds = relatedFiles.map((file) => file.id);
        const missingIds = updateAssetDto.fileIds.filter(id => !foundIds.includes(id));
        throw new BadRequestException(`The following files could not be found : ${missingIds.join(', ')}`);
      }

      // Remplace complètement les anciens fichiers
      fetchAsset.files = relatedFiles;}

      // Mise à jour des dates et prix
      if (updateAssetDto.purchaseDate) {
        fetchAsset.purchaseDate = new Date(updateAssetDto.purchaseDate);
      }
      if (updateAssetDto.productionStartDate) {
        fetchAsset.productionStartDate = new Date(updateAssetDto.productionStartDate);
      }
      if (updateAssetDto.purchasePrice !== undefined) {
        fetchAsset.purchasePrice = updateAssetDto.purchasePrice;
      }

      // Mise à jour de l'employé via AssetAssignment
      if (updateAssetDto.employeeId) {
      const employee = await this.userRepository.findOne({
      where: { id: updateAssetDto.employeeId },
      relations: ['role'],
      });

      if (!employee) {
        throw new BadRequestException('Employee not found');7
      }
      const userRole = employee.role as IUserRole;
      if (!userRole || userRole.role !== UserRoleEnum.EMPLOYEE) {
        throw new BadRequestException('User is not an employee');
      }
      const lastAssignment = await this.assetAssignmentRepository.findOne({
        where: { asset: { id: fetchAsset.id } },
        order: { assignedAt: 'DESC' },
      });
      
      if (!lastAssignment || (lastAssignment.employee as User).id !== employee.id) {
        const newAssignment = this.assetAssignmentRepository.create({
          asset: fetchAsset,
          employee,
        });
        await this.assetAssignmentRepository.save(newAssignment);
        fetchAsset.employee = employee;
      }
    }
    const updatedAsset = await this.assetRepository.save(fetchAsset);
    return updatedAsset;
  }
    
  // methode pour creation asset 
  async createAssetAndAssignToFile(createAssetDto: CreateAssetDto) {
  const { name, categoryId, supplierId, fileIds, locationId ,employeeId, purchaseDate, purchasePrice,productionStartDate} = createAssetDto;

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

  //  Créer l’asset sans QR code
  const asset = new Asset();
  asset.name = name;
  asset.category = category;
  asset.supplier = supplier;
  asset.location = location;
  asset.status = defaultStatus;

    // Nouveaux champs
  asset.purchaseDate = purchaseDate ?? null;
  asset.purchasePrice = purchasePrice ?? null;
  asset.productionStartDate = productionStartDate ?? null;

  // --- Ajoute ce code ici ---
  let employee: User | null = null;
  if (createAssetDto.employeeId) {
  employee = await this.userRepository.findOne({
    where: { id: createAssetDto.employeeId },
    relations: ['role'],
  });

  if (!employee) throw new Error('Employee not found');
  const userRole = employee.role as IUserRole;

  if (!userRole || userRole.role !== UserRoleEnum.EMPLOYEE) {
  throw new Error('User is not an employee');
}
  asset.employee = employee; 
}
asset.referenceNumber = await this.generateNextRef();


  const savedAsset = await this.assetRepository.save(asset);

  try {
    // Générer le QR code et  stocker dans l’asset
    await this.generateQrCodeAndAttachToAsset(savedAsset); 

    // Enregistrer l’historique de localisation
    const locationHistory = new LocationHistory();
    locationHistory.asset = savedAsset;
    locationHistory.location = location;
    await this.locationHistoryRepository.save(locationHistory);

    //  Enregistrer le statut de l’asset
    const assetStatus = new AssetStatus();
    assetStatus.asset = savedAsset;
    assetStatus.status = defaultStatus;
    await this.assetStatusRepository.save(assetStatus);

    //  Lier les fichiers à l’asset
    if (files.length > 0) {
      for (const file of files) {
        file.asset = savedAsset;
      }
      await this.fileRepository.save(files);
    }

      // Affectation
    if (employee) {
      const assetAssignment = this.assetAssignmentRepository.create({
        asset: savedAsset,
        employee: employee,
      });
      await this.assetAssignmentRepository.save(assetAssignment);
    }
    return savedAsset;
  } catch (error) {
    await this.assetRepository.remove(savedAsset); 
    throw new Error(`Unregistered asset. Problem during QR Code generation : ${error.message}`);
  }
}

async generateQrCodeAndAttachToAsset(asset: Asset) {
 const qrData = `${asset.id}`;
  const dataUrl = await QRCode.toDataURL(qrData); 
  const base64 = dataUrl.split(',')[1]; 

  asset.qrCode = base64; 
  await this.assetRepository.save(asset);
}


async generateNextRef(){
  const lastAsset = await this.assetRepository
    .createQueryBuilder('asset')
    .orderBy('CAST(asset.referenceNumber AS INTEGER)', 'DESC')
    .getOne();

  const lastRefNumber = lastAsset ? parseInt(lastAsset.referenceNumber, 10) : 0;
  const nextRefNumber = lastRefNumber + 1;

  // Format : 3 chiffres avec padding à gauche
  return nextRefNumber.toString().padStart(3, '0');
}


  //  methode pour get history by asseId 
 async getHistoryAssetById(assetId: string) {
  // Récupérer l'asset actuel
  const asset = await this.assetRepository.findOne({
    where: { id: assetId },
    relations: ['location', 'status', 'employee'],
  });

  if (!asset) {
    throw new NotFoundException('Asset not found');
  }

  let location = asset.location as Ilocation;
  let status = asset.status as Istatus;
  let employee = asset.employee as IUser;

  const locationEvents = await this.assetRepository.getLocationHistoryByAssetId(assetId);
  const statusEvents = await this.assetRepository.getStatusHistoryByAssetId(assetId);
  const employeeEvents = await this.assetAssignmentRepository.getAssignmentHistoryByAssetId(assetId);

  const allEvents: {
    date: Date;
    type: 'location' | 'status' | 'employee';
    value: string;
  }[] = [...locationEvents, ...statusEvents, ...employeeEvents];

  // Tri par date
  allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const groupedMap = new Map<string, { date: Date; values: { location?: string; status?: string; employee?: string } }>();

  for (const event of allEvents) {
    const dateKey = new Date(event.date).setMilliseconds(0);
    const existing = groupedMap.get(dateKey.toString());

    if (existing) {
      existing.values[event.type] = event.value;
    } else {
      groupedMap.set(dateKey.toString(), {
        date: new Date(dateKey),
        values: { [event.type]: event.value },
      });
    }
  }

  const timeline: {
    asset: string;
    assetId: string;
    location: string;
    status: string;
    employee: string;
    date: Date;
  }[] = [];

  let currentLocation = location?.name || '';
  let currentStatus = status?.name || '';
  let currentEmployee = employee ? `${employee.username} ` : 'Not affected';

  for (const group of groupedMap.values()) {
    if (group.values.location) currentLocation = group.values.location;
    if (group.values.status) currentStatus = group.values.status;
    if (group.values.employee) currentEmployee = group.values.employee;

    timeline.push({
      asset: asset.name,
      assetId: asset.id,
      location: currentLocation,
      status: currentStatus,
      employee: currentEmployee,
      date: group.date,
    });
  }

  return timeline;
}






async findOne(id: string) {
    return this.assetRepository.findOne({
      where: { id },
      relations: ['category', 'supplier', 'location', 'status'],
    });
  }

 
    async getStatistics() {
    const total = await this.assetRepository.countAll();
    const byStatus = await this.assetRepository.countByStatus();
    const byCategory = await this.assetRepository.countByCategory();

    return {
      total,
      byStatus,
      byCategory,
    };
  }

  async getTotalPurchasePrice() {
  const result = await this.assetRepository
    .createQueryBuilder('asset')
    .select('SUM(asset.purchasePrice)', 'total')
    .getRawOne();

  return parseFloat(result.total) || 0;
}



  async generateQrPdf(res: Response) {
    const assets = await this.assetRepository.find(); // ou `findAllAssetsNotInRepair()`
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=assets-qrcodes.pdf');
    doc.pipe(res);

    let count = 0;

    for (const asset of assets) {
      if (count > 0 && count % 4 === 0) {
        doc.addPage(); // 4 QR codes par page
      }

      const qrData = asset.qrCode || await QRCode.toDataURL(`Asset ID: ${asset.id}`);
      const img = qrData.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(img, 'base64');

      const x = 50 + (count % 2) * 270;
      const y = 50 + Math.floor((count % 4) / 2) * 320;

      doc.image(buffer, x, y, { width: 200, height: 200 });
      doc.fontSize(12).text(asset.name, x, y + 210, { width: 200, align: 'center' });
      doc.text(`Ref: ${asset.referenceNumber}`, x, y + 230, { width: 200, align: 'center' });

      count++;
    }

    doc.end();
  }

}

    