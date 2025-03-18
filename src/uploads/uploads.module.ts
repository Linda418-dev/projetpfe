import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';

import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Asset } from 'src/assets/Entities/Asset.entity';
import { File } from './entities/file.entity';
import { FileRepository } from './repositories/file.repository';
import { Category } from 'src/category/Entities/category.entity';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { Supplier } from 'src/supplier/Entities/Supplier.entity';
import { Place } from 'src/places/Entities/Place.entity';
import { HistoriqueLocationAsset } from 'src/historique-location-asset/entities/historique-location-asset.entity';
import { HistoriqueLocationAssetModule } from 'src/historique-location-asset/historique-location-asset.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File, Asset,Category,Supplier,Place,HistoriqueLocationAsset]), 
    HistoriqueLocationAssetModule,
    MulterModule.register({
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',  
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
          callback(new Error('Seules les images sont autorisées'), false);
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
  controllers: [UploadsController],
  providers: [UploadsService, FileRepository,CategoryRepository], 
  exports: [FileRepository, UploadsService], 
})
export class UploadsModule {}
