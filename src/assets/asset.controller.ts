import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAssetDto } from "./types/dto/create-asset.dto";
import { updateAssetDto } from "./types/dto/update-asset.dto";
import { AssetsService } from "./asset.service";

@ApiTags('Asset Resource')
@Controller('assets')
export class AssetController {
    constructor(private readonly assetService: AssetsService) {}

   
  
    @Get()
    async getAllAssets() {
    return this.assetService.getAllAssets();
    }

    

    @Get(':id')
    async getAssetById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.assetService.getAssetById(id);
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
  