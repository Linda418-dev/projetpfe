import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAssetDto } from "./types/dto/create-asset.dto";
import { updateAssetDto } from "./types/dto/update-asset.dto";
import { AssetsService } from "./asset.service";
import { Roles } from "src/auth/guards/roles.decorator";
import { PaginateSearchDto } from "./types/dto/paginate-search.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

// @ApiBearerAuth()
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
    // @UseGuards(JwtAuthGuard, RolesGuard)  
    // @Roles('admin') 
    async createAssetAndAssignToFile(@Body() createAssetDto: CreateAssetDto) {
    const asset = await this.assetService.createAssetAndAssignToFile(createAssetDto);
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
  