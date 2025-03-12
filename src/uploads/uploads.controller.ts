import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import { diskStorage } from 'multer';
import { UploadFileDto } from './types/dto/upload-file.dto';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
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
    })
  )
  @ApiOperation({ summary: 'Upload d\'une image et l\'associer à un asset' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Télécharger une image et l\'associer à un asset',
    type: UploadFileDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('assetId') assetId: string,
  ) {
    return await this.uploadsService.saveFileData(file, assetId);
  }
}
