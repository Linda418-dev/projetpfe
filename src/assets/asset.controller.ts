import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAssetDto } from "./types/dto/create-asset.dto";
import { updateAssetDto } from "./types/dto/update-asset.dto";
import { AssetsService } from "./asset.service";
import { Roles } from "src/jwt-auth/roles.decorator";
import { JwtAuthGuard } from "src/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "src/jwt-auth/roles.guard";

@ApiBearerAuth()
@ApiTags('Asset Resource')
@Controller('assets')
export class AssetController {
    constructor(private readonly assetService: AssetsService,  
    ) {}

    @Get('search')
    async searchAssets(@Query('keyword') keyword: string) {
        return this.assetService.searchAssets(keyword);
    }
  
    @Get('all-assets')
    @ApiOperation({ summary: 'get all assets' })
    async getAllAssets() {
        return this.assetService.getAllAssets();
    }
    
    @Get()
    @ApiOperation({ summary: 'get all assets' })
    async getAllAssetsWithPagination(@Query('page') page: number=1,@Query('limit') limit:number=4) {
    return this.assetService.getAllAssetsWithPagination(Number(page),Number(limit));
    }

    @Post('create-asset')
    @ApiOperation({ summary: 'Create  asset' })
    @UseGuards(JwtAuthGuard, RolesGuard)  
    @Roles('admin') 
    async createAssetAndAssignToFile(@Body() createAssetDto: CreateAssetDto) {
    const { assetName, categoryName, supplierName, fileId, serviceId  } = createAssetDto;
    const asset = await this.assetService.createAssetAndAssignToFile(createAssetDto);
   return {
     message: 'Asset successfully created and assigned to file, category, and service',
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
  