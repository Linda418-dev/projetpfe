import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAssetDto } from "./types/dto/create-asset.dto";
import { updateAssetDto } from "./types/dto/update-asset.dto";
import { AssetsService } from "./asset.service";
import { AssignFileToAssetDto } from "src/uploads/types/dto/assign-file.dto";
import { UploadsService } from "src/uploads/uploads.service";

@ApiTags('Asset Resource')
@Controller('assets')
export class AssetController {
    constructor(private readonly assetService: AssetsService,
   
    ) {}

    @Get('search')
    async searchAssets(@Query('keyword') keyword: string) {
        return this.assetService.searchAssets(keyword);
    }
  
    @Get()
    @ApiOperation({ summary: 'get all assets' })
    async getAllAssets() {
    return this.assetService.getAllAssets();
    }

    @Post('create-asset')
    @ApiOperation({ summary: 'Create  asset' })
    async createAssetAndAssignToFile(@Body() assignFileToAssetDto: AssignFileToAssetDto) {
    const { assetName, categoryName, supplierName, fileId, locationName } = assignFileToAssetDto;
    const asset = await this.assetService.createAssetAndAssignToFile(assignFileToAssetDto);
   return {
     message: 'Asset successfully created and assigned to file, category, and location',
     asset,
   };
  }

  @Get(':id')
    @ApiOperation({ summary: 'get asset by id' })
    async getAssetById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.assetService.getAssetById(id);
    }

   @Patch(':id')
    @ApiOperation({ summary: 'edit asset' })
    async updateAsset(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateAssetDto: updateAssetDto) {
        return this.assetService.updateAsset(id, updateAssetDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'delete asset' })
    async deleteAsset(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.assetService.deleteAsset(id);
    }
  
    
     
  }
  