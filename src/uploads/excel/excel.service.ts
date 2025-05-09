import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { Asset } from 'src/assets/Entities/Asset.entity';

@Injectable()
export class ExcelService { 
    async exportAssetsToExcel(assets: Asset[]) {
    // créer un nouveau classeur excel     
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Assets');

    // En-têtes de colonnes
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 36 },
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
      worksheet.addRow({
        id: asset.id,
        name: asset.name,
        category: asset.category?.name,
        supplier: asset.supplier?.name,
        location: asset.location?.name,
        status: asset.status?.name,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      });
    });

    // Génération du fichier Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
