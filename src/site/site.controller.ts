import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SiteService } from './site.service';
import { CreateSiteDto } from './Types/dto/create-site.dto';
import { updateSiteDto } from './Types/dto/update-site.dto';


@ApiTags('Site Resource')
@Controller('sites')
export class SiteController {
constructor(private readonly siteService:SiteService){}

    @Get()
    @ApiOperation({ summary: 'get all sites' })
    async getAllSites(){
        return this .siteService.getAllSites();
    }

    @Post()
    @ApiOperation({ summary: 'create site' })
    async createSite(@Body() createSiteDto : CreateSiteDto ){
        return this.siteService.createSite(createSiteDto);
    }
   
    @Get(':id')
    @ApiOperation({ summary: 'get site by id ' })
    async getSiteById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.siteService.getSiteById(id); 
    }

     @Patch(':id')
     @ApiOperation({ summary: 'edit site' })
    async updateSite(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateSiteto: updateSiteDto) {
    return this.siteService.updateSite(id, updateSiteto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'delete site' })
    async deleteSite(@Param('id',new ParseUUIDPipe()) id : string){
        return this.siteService.deleteSite(id);
    }
}
