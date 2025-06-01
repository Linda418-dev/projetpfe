import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAssetDto } from "./types/dto/create-asset.dto";
import { updateAssetDto } from "./types/dto/update-asset.dto";
import { AssetsService } from "./asset.service";
import { PaginateSearchDto } from "./types/dto/paginate-search.dto";
import { Response } from 'express';
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

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

  @Get('by-site')
  @UseGuards(JwtAuthGuard)
  async getAssetsBySite(@Req() req) {
  console.log('USER PAYLOAD:', req.user); 
  const siteId = req.user.site?.id;
  console.log('Site ID:', req.user.siteId);
  return this.assetService.getAssetsBySite(siteId);
}

  
  @Get('statistics')
  async getStatistics() {
  return this.assetService.getStatistics();
  }

  @Get('total-purchase-price')
  getTotalPrice() {
  return this.assetService.getTotalPurchasePrice();
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
  @ApiOperation({ summary: 'Get asset history status and location and employee' })
  async getHistoryAssetById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.assetService.getHistoryAssetById(id);
  }

  @Get(':id/qrcode')
  async downloadQrCode(@Param('id') id: string, @Res() res: Response) {
    const asset = await this.assetService.findOne(id);
      if (!asset || !asset.qrCode) {
        throw new NotFoundException('QR Code not found');
      }
      // Convertir le base64 en Buffer
    const base64Data = asset.qrCode.replace(/^data:image\/png;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');
    res.set({
    'Content-Type': 'image/png',
    'Content-Disposition': `attachment; filename="qr-code-${asset.id}.png"`,
    'Content-Length': imgBuffer.length,
  });
  res.end(imgBuffer);
}



}
  