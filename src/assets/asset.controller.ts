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
   //declarere here
   @Post('create-asset-and-assign-file')
  @ApiOperation({ summary: 'Create an asset, assign it to a category and a file' })
  async createAssetAndAssignToFile(@Body() assignFileToAssetDto: AssignFileToAssetDto) {
  const { assetName, categoryName, supplierName, fileId, locationName } = assignFileToAssetDto;
  const asset = await this.assetService.createAssetAndAssignToFile(assignFileToAssetDto);
  return {
    message: 'Asset successfully created and assigned to file, category, and location',
    asset,
  };
}
    
     
  }
  