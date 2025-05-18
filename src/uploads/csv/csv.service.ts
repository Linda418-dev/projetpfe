// src/uploads/csv/csv.service.ts

import { Injectable } from '@nestjs/common';
import { Asset } from 'src/assets/Entities/asset.entity';
import { ICategory } from 'src/category/types/interface/category.interface';
import { ISupplier } from 'src/supplier/types/interfaces/Supplier.interface';
import { Istatus } from 'src/status/types/interfaces/status.interface';
import { Ilocation } from 'src/location/types/interfaces/location.interface';
import { format } from '@fast-csv/format';
import { InventoryDetailsRepository } from 'src/inventory-details/repositories/inventory-details.repository';
import { Affectation } from 'src/affectation/entities/affectation.entity';
import { User } from 'src/user/entities/user.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { LocationHistory } from 'src/location-history/entities/location-history.entity';
import { AssetStatus } from 'src/asset-status/entities/asset-status.entity';
import { Status } from 'src/status/entities/status.entity';
import { Location } from 'src/location/entities/location.entity';


@Injectable()
export class CsvService {
    constructor (
        private readonly inventoryDetailsRepository :InventoryDetailsRepository
    ){}
  async exportAssetsToCSV(assets: Asset[]){
    const rows = assets.map(asset => {
      const category = asset.category as ICategory;
      const supplier = asset.supplier as ISupplier;
      const location = asset.location as Ilocation;
      const status = asset.status as Istatus;

      return {
        Name: asset.name,
        Category: category?.name ?? '',
        Supplier: supplier?.name ?? '',
        Location: location?.name ?? '',
        Status: status?.name ?? '',
        CreatedAt: asset.createdAt?.toISOString() ?? '',
        UpdatedAt: asset.updatedAt?.toISOString() ?? '',
      };
    });

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const stream = format({ headers: true, delimiter: ';' })
        .on('data', chunk => chunks.push(Buffer.from(chunk)))
        .on('end', () => resolve(Buffer.concat(chunks)))
        .on('error', err => reject(err));

      rows.forEach(row => stream.write(row));
      stream.end();
    });
  }

 async exportInventoryDetailsToCSV(inventoryId: string): Promise<Buffer> {
  const details = await this.inventoryDetailsRepository.findDetailsByInventoryId(inventoryId);

  const rows = details.map((detail) => {
    const affectation = detail.affectation as Affectation;
    const operator = affectation.operator as User;
    const inventory = affectation.inventory as Inventory;
    const locationHistory = detail.locationHistory as LocationHistory;
    const location = locationHistory?.location as Location;
    const asset = locationHistory?.asset as Asset;
    const assetStatus = detail.assetStatus as AssetStatus;
    const status = assetStatus?.status as Status;

    return {
      NomInventaire: inventory?.name ?? 'Non défini',
      Operateur: operator?.email ?? 'Non défini',
      DateScan: detail.scannedAt?.toISOString().split('T')[0] ?? 'Non défini',
      NomBien: asset?.name ?? 'N/A',
      Emplacement: location?.name ?? 'N/A',
      Statut: status?.name ?? 'N/A',
    };
  });

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = format({ headers: true, delimiter: ';' })
      .on('data', chunk => chunks.push(Buffer.from(chunk)))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', err => reject(err));

    rows.forEach(row => stream.write(row));
    stream.end();
  });
}
}
