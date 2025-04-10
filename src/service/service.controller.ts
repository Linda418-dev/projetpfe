import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateServiceDto } from './types/dto/create-service.dto';
import { UpdateServiceDto } from './types/dto/update-service.dto';

@ApiTags('Service Resource')
@Controller('services')
export class ServiceController {
     constructor(private readonly serviceService: ServiceService) {}
      
     @Get()
    @ApiOperation({ summary: 'get all services' })
     getAllServices() {
         return this.serviceService.getAllServices();
     }

     @Post()
     @ApiOperation({ summary: 'create service' })
     createService(
       @Body() createServiceDto: CreateServiceDto,
       @Query('departmentId') departmentId: string,
     ) {
       if (!departmentId) {
         throw new BadRequestException('Missing required query parameter: departmentId');
       }
     
       return this.serviceService.createService(createServiceDto, departmentId);
     }
     

     @Get(':id')
     @ApiOperation({ summary: 'get service  by id' })
     getServiceById(@Param('id') id: string) {
         return this.serviceService.getServiceById(id);
     }

     @Patch(':id')
     @ApiOperation({ summary: 'edit Service' })
     async updateService(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateServiceDto: UpdateServiceDto) {
     return this.serviceService.updateService(id, updateServiceDto);
         }
  
     @Delete(':id')
     @ApiOperation({ summary: 'delete service' })
     deleteService(@Param('id') id: string) {
         return this.serviceService.deleteService(id);
     }
}

