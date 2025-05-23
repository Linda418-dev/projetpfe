import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAssetDto } from "./types/dto/create-asset.dto";
import { updateAssetDto } from "./types/dto/update-asset.dto";
import { AssetsService } from "./asset.service";
import { PaginateSearchDto } from "./types/dto/paginate-search.dto";
import { AssignMultipleAssetsDto } from "./types/dto/assign-multiple-assets.dto";
import { Response } from 'express';



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

  @Patch('assign-multiple')
  async assignMultipleAssetsToUser(@Body() assignDto: AssignMultipleAssetsDto) {
    return this.assetService.assignMultipleAssetsToUser(assignDto.assetIds, assignDto.userId);
  }

  @Get('statistics')
  async getStatistics() {
  return this.assetService.getStatistics();
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
  