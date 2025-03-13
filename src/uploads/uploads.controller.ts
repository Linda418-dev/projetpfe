import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { CreateFileDto } from './types/dto/create-file.dto';  // Assurez-vous que le chemin est correct

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))  // Utilisation de l'intercepteur pour l'upload de fichiers
  @ApiConsumes('multipart/form-data')  // Consommation de multipart/form-data
  @ApiBody({
    description: 'Upload a file',
    type: CreateFileDto,  // Utilisation du DTO ici
  })
  @ApiOperation({ summary: 'Upload a file to be saved in the file table with default assetId as null' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadsService.createFile(file);
  }
}
