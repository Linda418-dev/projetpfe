import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateServiceDto } from './types/dto/create-service.dto';
import { UpdateServiceDto } from './types/dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiBearerAuth()
@ApiTags('Service Resource')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin','operator')
  @ApiOperation({ summary: 'Get all services by departmentIds' })
  @ApiQuery({ name: 'departmentIds', required: true, type: String, isArray: true })
  getAllServicesByDepartments(
  @Query('departmentIds') departmentIds: string[] | string) {
  const ids = Array.isArray(departmentIds)
    ? departmentIds
    : departmentIds.split(',');
  return this.serviceService.getAllServicesByDepartments(ids);
  }

    @Get('get-all-srevice')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'get all services' })
    getAllServices() {
      return this.serviceService.getAllServices();
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'create service' })
    createService(
    @Body() createServiceDto: CreateServiceDto,@Query('departmentId') departmentId: string,) {
      if (!departmentId) {
        throw new BadRequestException('Missing required query parameter: departmentId');
      }
      return this.serviceService.createService(createServiceDto, departmentId);
    }
    
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'get service  by id' })
    getServiceById(@Param('id') id: string) {
      return this.serviceService.getServiceById(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'edit Service' })
    async updateService(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.updateService(id, updateServiceDto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'delete service' })
    deleteService(@Param('id') id: string) {
      return this.serviceService.deleteService(id);
    }

}

