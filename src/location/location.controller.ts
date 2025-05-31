import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './types/dto/create-location.dto';
import { UpdateLocationDto } from './types/dto/update-location.dto';

@ApiTags('Location Resource')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('by-service')
  @ApiOperation({ summary: 'Get all locations by serviceId' })
  getAllLocationsByService(@Query('serviceId') serviceId: string) {
    return this.locationService.getAllLocationsByService(serviceId);
  }
  
  @Get()
  @ApiOperation({ summary: 'get all locations' })
  getAllLocations() {
    return this.locationService.getAllLocations();
  }
  
  @Post()
  @ApiOperation({ summary: 'create location' })
  createLocation(@Body() createLocationDto: CreateLocationDto,@Query('serviceId') serviceId: string,){
    if (!serviceId) {
      throw new BadRequestException('Missing required query parameter: serviceId');
    }
    return this.locationService.createLocation(createLocationDto, serviceId);
  }
         
    
  @Get(':id')
  @ApiOperation({ summary: 'get location  by id' })
  getLocationById(@Param('id') id: string) {
    return this.locationService.getLocationById(id);
  }
    
  @Patch(':id')
  @ApiOperation({ summary: 'edit location' })
  async updateLocation(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.updateLocation(id, updateLocationDto);
  }
      
  @Delete(':id')
  @ApiOperation({ summary: 'delete location' })
  deleteLocation(@Param('id') id: string) {
    return this.locationService.deleteLocation(id);
  }
}
