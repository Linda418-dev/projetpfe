import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { FileRepository } from './repositories/file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from 'src/assets/Entities/Asset.entity';
import {File} from'./entities/file.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([File, Asset]), 

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
        destination: './uploadsFiles',
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
  providers: [UploadsService, FileRepository],
  exports: [FileRepository,UploadsService], 

})
export class UploadsModule {}
