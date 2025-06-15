import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SiteService } from './site.service';
import { CreateSiteDto } from './Types/dto/create-site.dto';
import { updateSiteDto } from './Types/dto/update-site.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiBearerAuth()
@ApiTags('Site Resource')
@Controller('sites')
export class SiteController {
constructor(private readonly siteService:SiteService){}

    @Get()
    @ApiOperation({ summary: 'get all sites' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator','technician','employee')
    async getAllSites(){
        return this .siteService.getAllSites();
    }
    
    
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin')
    @ApiOperation({ summary: 'create site' })
    async createSite(@Body() createSiteDto : CreateSiteDto ){
        return this.siteService.createSite(createSiteDto);
    }
   
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'get site by id ' })
    async getSiteById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.siteService.getSiteById(id); 
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin')
    @ApiOperation({ summary: 'edit site' })
    async updateSite(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateSiteto: updateSiteDto) {
    return this.siteService.updateSite(id, updateSiteto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin')
    @ApiOperation({ summary: 'delete site' })
    async deleteSite(@Param('id',new ParseUUIDPipe()) id : string){
        return this.siteService.deleteSite(id);
    }
}
