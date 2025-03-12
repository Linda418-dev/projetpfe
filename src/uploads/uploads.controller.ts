import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from './types/dto/upload-file.dto';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file')) // Multer est déjà configuré dans le module
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
