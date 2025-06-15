import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as ExcelJS from 'exceljs';
import { Affectation } from 'src/affectation/entities/affectation.entity';
import { AssetStatus } from 'src/asset-status/entities/asset-status.entity';
import { Asset } from 'src/assets/Entities/asset.entity';
import { ICategory } from 'src/category/types/interface/category.interface';
import { InventoryDetailsRepository } from 'src/inventory-details/repositories/inventory-details.repository';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { LocationHistory } from 'src/location-history/entities/location-history.entity';
import { Location } from 'src/location/entities/location.entity';
import { Ilocation } from 'src/location/types/interfaces/location.interface';
import { Status } from 'src/status/entities/status.entity';
import { Istatus } from 'src/status/types/interfaces/status.interface';
import { ISupplier } from 'src/supplier/types/interfaces/Supplier.interface';
import { User } from 'src/user/entities/user.entity';
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
      { header: 'reference', key: 'reference', width: 20 },
      { header: 'purchaseDate', key: 'purchaseDate', width: 20 },
      { header: 'purchasePrice', key: 'purchasePrice', width: 20 },
      { header: 'employee', key: 'employee', width: 20 },
      { header: 'productionStartDate', key: 'productionStartDate', width: 20 },
    ];
    
  // ajouter les lignes de données d'un asset 
  assets.forEach(asset => {
  let category =  asset.category as ICategory;
  let supplier = asset.supplier as ISupplier;
  let location = asset.location as Ilocation;
  let status = asset.status as Istatus;
  let employee = asset.employee as IUser;
      worksheet.addRow({
        name: asset.name,
        category: category.name,
        supplier: supplier.name,
        location: location.name,
        status: status.name,
        reference: asset.referenceNumber,
        purchaseDate : asset.purchaseDate,
        purchasePrice : asset.purchasePrice,
        employee:employee.username,
        productionStartDate:asset.productionStartDate,
      });
    });

    // Génération du fichier Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

 async exportInventoryDetailsByInventoryId(inventoryId: string) {
   const details = await this.inventoryDetailsRepository.findDetailsByInventoryId(inventoryId);


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
    const affectation = detail.affectation as Affectation;
    const operator = affectation.operator as User;
    const inventory = affectation.inventory as Inventory;
    const locationHistory = detail.locationHistory as LocationHistory;
    const location = locationHistory?.location as Location;
    const asset = locationHistory?.asset as Asset;
    const assetStatus = detail.assetStatus as AssetStatus;
    const status = assetStatus?.status as Status;

    worksheet.addRow({
      inventory: inventory?.name ?? 'Non défini',
      operator: operator?.email ?? 'Non défini',
      scannedAt: detail.scannedAt?.toISOString().split('T')[0] ?? 'Non défini',
      assetName: asset?.name ?? 'Non défini',
      locationName: location?.name ?? 'Non défini',
      statusName: status?.name ?? 'Non défini',
    });
  }

  return await workbook.xlsx.writeBuffer();
}


}
