import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAssetDto } from "./types/dto/create-asset.dto";
import { updateAssetDto } from "./types/dto/update-asset.dto";
import { AssetsService } from "./asset.service";
import { PaginateSearchDto } from "./types/dto/paginate-search.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Request } from 'express'; 
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/guards/roles.decorator";


@ApiBearerAuth()
@ApiTags('Asset Resource')
@Controller('assets')
export class AssetController {
    constructor(private readonly assetService: AssetsService,  
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @Get('all-assets')
    @ApiOperation({ summary: 'get all assets' })
    async getAllAssets() {
        return this.assetService.getAllAssets();
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin')
    @Get()
    async getAssets(@Query() params: PaginateSearchDto) {
      return this.assetService.getAssets(params);
    } 

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin')
    @Post('create-asset')
    @ApiOperation({ summary: 'Create  asset' })
    async createAssetAndAssignToFile(@Body() createAssetDto: CreateAssetDto) {
    const asset = await this.assetService.createAssetAndAssignToFile(createAssetDto);
    return {
     message: 'Asset successfully created and assigned to file, category, and location',
     asset,
   };
   }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Get('by-site')
  async getAssetsBySite(@Req() req) {
  console.log('USER PAYLOAD:', req.user); 
  const siteId = req.user.site?.id;
  console.log('Site ID:', req.user.siteId);
  return this.assetService.getAssetsBySite(siteId);
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Get('statistics')
  async getStatistics() {
  return this.assetService.getStatistics();
  }
  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Get('total-purchase-price')
  getTotalPrice() {
  return this.assetService.getTotalPurchasePrice();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator','technician','employee')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all assets assigned to the connected employee' })
  async getMyAssets(@Req() req: Request) {
    const userId = req.user['id']; 
    return this.assetService.getAssetsByEmployee(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator')
  @Get(':id')
  @ApiOperation({ summary: 'get asset by id' })
  async getAssetById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.assetService.getAssetById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator','technician')
  @ApiOperation({ summary: 'edit asset' })
  async updateAsset(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateAssetDto: updateAssetDto) {
    return this.assetService.updateAsset(id, updateAssetDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @ApiOperation({ summary: 'delete asset' })
  async deleteAsset(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.assetService.deleteAsset(id);
  }  

  @Get(':id/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @ApiOperation({ summary: 'Get asset history status and location and employee' })
  async getHistoryAssetById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.assetService.getHistoryAssetById(id);
  }

}
  