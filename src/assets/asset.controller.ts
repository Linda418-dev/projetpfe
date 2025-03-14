import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { updateAssetDto } from './types/dto/update-asset.dto';
import { AssetService } from './asset.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAssetDto } from './types/dto/create-asset.dto';
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
        const newAsset = await this.assetService.createAsset(createAssetDto);
        return this.assetService.getAssetById(newAsset.id); 
      }
  
      @Delete(':id')
      async deleteAsset(@Param('id', new ParseUUIDPipe()) id: string) {
          return this.assetService.deleteAsset(id);
      }
  
      @Patch(':id')
      async updateAsset(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateAssetDto: updateAssetDto) {
          return this.assetService.updateAsset(id, updateAssetDto);
      }
    


  }
  