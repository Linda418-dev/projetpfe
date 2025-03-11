import { 
    BadRequestException,
    Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseInterceptors 
  } from '@nestjs/common';
  import { CreateAssetDto } from './types/dto/create-asset.dto';
  import { updateAssetDto } from './types/dto/update-asset.dto';
  import { AssetService } from './asset.service';
  import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer'; 
import { FileUploadDto } from 'src/assets/types/dto/FileUpload.dto';
  
  @ApiTags('Asset ressource')
  @Controller('asset')
  export class AssetController {
      constructor(private readonly assetService: AssetService) {}
  
      @Get()
      async getAllAssets() {
          return this.assetService.getAllAssets();
      }
  
      @Get(':id')
      async getAssetById(@Param('id', new ParseUUIDPipe()) id: string) {
          return this.assetService.getAssetById(id);
      }
  
      @Post()
      async CreateAsset(@Body() createAssetDto: CreateAssetDto) {
          return this.assetService.createAsset(createAssetDto);
      }
  
      @Delete(':id')
      async deleteAsset(@Param('id', new ParseUUIDPipe()) id: string) {
          return this.assetService.deleteAsset(id);
      }
  
      @Patch(':id')
      async updateAsset(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateAssetDto: updateAssetDto) {
          return this.assetService.updateAsset(id, updateAssetDto);
      }
      @Post('upload')  // Vérifie que cette route est correctement définie
      @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            callback(null, uniqueName);
          },
        }),
      }))
      @ApiConsumes('multipart/form-data')
      @ApiBody({ description: 'Upload image', type: FileUploadDto })
      async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
          throw new BadRequestException('No file uploaded');
        }
    
        console.log('Fichier reçu:', file);
    
        return { filename: file.filename, url: `uploads/${file.filename}` };
      }




  }
  