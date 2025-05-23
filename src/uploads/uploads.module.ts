import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';

import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Asset } from 'src/assets/Entities/asset.entity';
import { File } from './entities/file.entity';
import { FileRepository } from './repositories/file.repository';
import { Category } from 'src/category/Entities/category.entity';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { Supplier } from 'src/supplier/Entities/Supplier.entity';
import { ExcelController } from './excel/excel.controller';
import { ExcelService } from './excel/excel.service';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { InventoryDetailsRepository } from 'src/inventory-details/repositories/inventory-details.repository';
import { CsvController } from './csv/csv.controller';
import { CsvService } from './csv/csv.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([File, Asset,Category,Supplier]), 
    MulterModule.register({
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg', 
          'image/jpg',  
 
          'image/png',   
          'image/gif',   
          'image/webp',   
          'image/svg+xml',
          'image/bmp',   
          'image/tiff',  
          'image/heic'   
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true); 
        } else {
          callback(new Error('files autorisées'), false);
        }
      },
     storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = path.parse(file.originalname).name;
          const ext = path.extname(file.originalname);
          const filename = `${name}-${Date.now()}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [UploadsController, ExcelController, CsvController],
  providers: [UploadsService, FileRepository,CategoryRepository, ExcelService,AssetRepository,ExcelService,ExcelController,InventoryDetailsRepository, CsvService,CsvController,ConfigService ], 
  exports: [FileRepository, UploadsService], 
})
export class UploadsModule {}
