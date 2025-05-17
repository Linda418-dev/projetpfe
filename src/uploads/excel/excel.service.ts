import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as ExcelJS from 'exceljs';
import { Iaffectation } from 'src/affectation/types/interfaces/affectation.interface';
import { IAssetStatus } from 'src/asset-status/types/interfaces/asset-status.interface';
import { Asset } from 'src/assets/Entities/asset.entity';
import { IAsset } from 'src/assets/types/interface/Asset.interface';
import { ICategory } from 'src/category/types/interface/category.interface';
import { InventoryDetailsRepository } from 'src/inventory-details/repositories/inventory-details.repository';
import { Iinventory } from 'src/inventory/types/interfaces/inventory.interface';
import { ILocationHistory } from 'src/location-history/types/interfaces/location-history.interface';
import { Ilocation } from 'src/location/types/interfaces/location.interface';
import { Istatus } from 'src/status/types/interfaces/status.interface';
import { ISupplier } from 'src/supplier/types/interfaces/Supplier.interface';
import { IUser } from 'src/user/types/interface/user.interface';

@Injectable()
export class ExcelService { 
  constructor (private readonly inventoryDetailsRepository : InventoryDetailsRepository){}
    async exportAssetsToExcel(assets: Asset[]) {
    // créer un nouveau classeur excel     
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Assets');

    // En-têtes de colonnes
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Supplier', key: 'supplier', width: 20 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 },
      { header: 'Updated At', key: 'updatedAt', width: 25 },
    ];
    
  // ajouter les lignes de données d'un asset 
   
  assets.forEach(asset => {
  let category =  asset.category as ICategory;
  let supplier = asset.supplier as ISupplier;
  let location = asset.location as Ilocation;
  let status = asset.status as Istatus;
      worksheet.addRow({
        name: asset.name,
        category: category.name,
        supplier: supplier.name,
        location: location.name,
        status: status.name,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      });
    });

    // Génération du fichier Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async exportInventoryDetailsByInventoryId(inventoryId: string) {
    const details = await this.inventoryDetailsRepository
    .createQueryBuilder('details')
    .leftJoinAndSelect('details.affectation', 'affectation')
    .leftJoinAndSelect('affectation.operator', 'operator')
    .leftJoinAndSelect('affectation.inventory', 'inventory')
    .leftJoinAndSelect('details.locationHistory', 'locationHistory')
    .leftJoinAndSelect('locationHistory.location', 'location')
    .leftJoinAndSelect('locationHistory.asset', 'asset')
    .leftJoinAndSelect('asset.status', 'assetStatusFromAsset')
    .leftJoinAndSelect('details.assetStatus', 'assetStatus')
    .leftJoinAndSelect('assetStatus.status', 'status')
    .where('inventory.id = :inventoryId', { inventoryId })
    .getMany();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Biens Scannés');

    worksheet.columns = [
      { header: 'Nom Inventaire', key: 'inventory', width: 20 },
      { header: 'Opérateur', key: 'operator', width: 20 },
      { header: 'Date Scan', key: 'scannedAt', width: 20 },
      { header: 'Nom Bien', key: 'assetName', width: 20 },
      { header: 'Emplacement', key: 'locationName', width: 20 },
      { header: 'Statut', key: 'statusName', width: 15 },
    ];

    for (const detail of details) {
      let operator = detail.affectation as IUser;
      let inventory = detail.affectation as Iinventory;
      let locationHistory = detail.locationHistory as Ilocation;
      let assetName = detail.locationHistory as IAsset;
      let statusName = detail.assetStatus as IAsset;
      worksheet.addRow({
        inventory: inventory.name,
        operator: operator.email ?? 'Non défini',
        scannedAt: detail.scannedAt.toISOString().split('T')[0],
        assetName: assetName.name ?? 'N/A',
        locationName: locationHistory.name ?? 'N/A',
        statusName: statusName.name ?? 'N/A',
      });
    }

    return await workbook.xlsx.writeBuffer();
  }
}
