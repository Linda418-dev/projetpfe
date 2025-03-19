import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './Types/dto/create-place.dto';
import { updatePlaceDto } from './Types/dto/update-place.dto';

@ApiTags('Place Resource')
@Controller('places')
export class PlacesController {

    constructor(private readonly placeService:PlacesService){}

    @Get()
    @ApiOperation({ summary: 'get all places' })
    async getAllPlaces(){
        return this .placeService.getAllPlaces();
    }

    @Post()
    @ApiOperation({ summary: 'create place' })
    async CreatePlace(@Body() createPlaceDto : CreatePlaceDto ){
        return this.placeService.CreatePlace(createPlaceDto);
    }
   
    @Get(':id')
    @ApiOperation({ summary: 'get place by id ' })
    async getPlaceById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.placeService.getPlaceById(id); 
    }

     @Patch(':id')
     @ApiOperation({ summary: 'edit place' })
    async updateplace(@Param('id', new ParseUUIDPipe()) id: string,@Body() updatePlaceDto: updatePlaceDto) {
    return this.placeService.updateplace(id, updatePlaceDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'delete place' })
    async deletePlace(@Param('id',new ParseUUIDPipe()) id : string){
        return this.placeService.deletePlace(id);
    }



}
