import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './Types/dto/create-place.dto';
import { updatePlaceDto } from './Types/dto/update-place.dto';

@ApiTags('Place Resource')
@Controller('places')
export class PlacesController {

    constructor(private readonly placeService:PlacesService){}
    @Get()
    async getAllPlaces(){
        return this .placeService.getAllPlaces();
    }
    @Get('names')
    async getAllPlaceNames() {
      return this.placeService.getAllPlacesNames();
    }

    @Get(':id')
    async getPlaceById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.placeService.getPlaceById(id); 
    }

    @Post()
    async CreatePlace(@Body() createPlaceDto : CreatePlaceDto ){
        return this.placeService.CreatePlace(createPlaceDto);
    }

    @Delete(':id')
    async deletePlace(@Param('id',new ParseUUIDPipe()) id : string){
        return this.placeService.deletePlace(id);
    }
    @Patch(':id')
    async updateplace(@Param('id', new ParseUUIDPipe()) id: string,@Body() updatePlaceDto: updatePlaceDto) {
    return this.placeService.updateplace(id, updatePlaceDto);
    }



}
