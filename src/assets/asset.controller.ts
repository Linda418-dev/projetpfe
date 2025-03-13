import { 
    BadRequestException,
    Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseInterceptors 
  } from '@nestjs/common';
  import { updateAssetDto } from './types/dto/update-asset.dto';
  import { AssetService } from './asset.service';
  import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';


  
  @ApiTags('Asset ressource')
  @Controller('asset')
  export class AssetController {
      constructor(private readonly assetService: AssetService) {}
  
      @Get()
      async getAllAssets() {
          return this.assetService.getAllAssets();
      }
  
      @Get(':id')
      async getAssetById(@Param('id', new ParseUUIDPipe()) id: number) {
          return this.assetService.getAssetById(id);
      }
  
      @Post()
   
      @Delete(':id')
      async deleteAsset(@Param('id', new ParseUUIDPipe()) id: number) {
          return this.assetService.deleteAsset(id);
      }
    @Patch(':id')
      async updateAsset(@Param('id', new ParseUUIDPipe()) id: number, @Body() updateAssetDto: updateAssetDto) {
          return this.assetService.updateAsset(id, updateAssetDto);
      }
  }
  