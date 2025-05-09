import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAssetDto } from "./types/dto/create-asset.dto";
import { updateAssetDto } from "./types/dto/update-asset.dto";
import { AssetsService } from "./asset.service";
import { PaginateSearchDto } from "./types/dto/paginate-search.dto";

@ApiBearerAuth()
@ApiTags('Asset Resource')
@Controller('assets')
export class AssetController {
    constructor(private readonly assetService: AssetsService,  
    ) {}

    @Get('all-assets')
    @ApiOperation({ summary: 'get all assets' })
    async getAllAssets() {
        return this.assetService.getAllAssets();
    }

    @Get()
    async getAssets(@Query() params: PaginateSearchDto) {
      return this.assetService.getAssets(params);
    } 

    @Post('create-asset')
    @ApiOperation({ summary: 'Create  asset' })
    async createAssetAndAssignToFile(@Body() createAssetDto: CreateAssetDto) {
    const asset = await this.assetService.createAssetAndAssignToFile(createAssetDto);
    return {
     message: 'Asset successfully created and assigned to file, category, and location',
     asset,
   };
  }

    @Get('percentage-good-assets')
    @ApiOperation({ summary: 'get Assets Status Statistics' })
    async getAssetsStatusStatistics() {
    return this.assetService.getAssetsStatusStatistics();
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

    @Get(':id/history')
    @ApiOperation({ summary: 'Get asset history status and location' })
    async getHistoryAssetById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.assetService.getHistoryAssetById(id);
    }
  }
  