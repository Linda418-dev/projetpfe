import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './types/dto/create-location.dto';
import { UpdateLocationDto } from './types/dto/update-location.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiBearerAuth()
@ApiTags('Location Resource')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  
  @Get('by-services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator')
  @ApiOperation({ summary: 'Get all locations by multiple serviceIds' })
  @ApiQuery({ name: 'serviceIds', type: String, isArray: true, required: true })
  getAllLocationsByServices(@Query('serviceIds') serviceIds: string[] | string) {
  const ids = Array.isArray(serviceIds)
    ? serviceIds
    : serviceIds.split(',');
  return this.locationService.getAllLocationsByServices(ids);
}
  
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator')
  @ApiOperation({ summary: 'get all locations' })
  getAllLocations() {
    return this.locationService.getAllLocations();
  }
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator')
  @ApiOperation({ summary: 'create location' })
  createLocation(@Body() createLocationDto: CreateLocationDto,@Query('serviceId') serviceId: string,){
    if (!serviceId) {
      throw new BadRequestException('Missing required query parameter: serviceId');
    }
    return this.locationService.createLocation(createLocationDto, serviceId);
  }
         
    
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator')
  @ApiOperation({ summary: 'get location  by id' })
  getLocationById(@Param('id') id: string) {
    return this.locationService.getLocationById(id);
  }
    
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator')
  @ApiOperation({ summary: 'edit location' })
  async updateLocation(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.updateLocation(id, updateLocationDto);
  }
      
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator')
  @ApiOperation({ summary: 'delete location' })
  deleteLocation(@Param('id') id: string) {
    return this.locationService.deleteLocation(id);
  }
}
