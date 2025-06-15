import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './types/dto/create-department.dto';
import { UpdateDepartmentDto } from './types/dto/update-department.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiBearerAuth()
@ApiTags('Department Resource')
@Controller('departments')
export class DepartmentController {
   
    constructor(private readonly departmentService: DepartmentService) {}

         @Get('get-all-department')
         @UseGuards(JwtAuthGuard, RolesGuard)
         @Roles('admin', 'superAdmin','operator')
         @ApiOperation({ summary: 'get all departments' })
         getAllDepartments() {
             return this.departmentService.getAllDepartments();
         }
    
         @Post()
         @UseGuards(JwtAuthGuard, RolesGuard)
         @Roles('admin', 'superAdmin')
         @ApiOperation({ summary: 'create department' })
         createDepartment(
           @Body() createDepartmentDto: CreateDepartmentDto,
           @Query('siteId') siteId: string,
         ) {
           if (!siteId) {
             throw new BadRequestException('Missing required query parameter: siteId');
           }
         
           return this.departmentService.createDepartment(createDepartmentDto, siteId);
           }
         
         
         @Get(':id')
         @UseGuards(JwtAuthGuard, RolesGuard)
         @Roles('admin', 'superAdmin','operator')
         @ApiOperation({ summary: 'get department by id' })
         getDepartmentById(@Param('id') id: string) {
             return this.departmentService.getDepartmentById(id);
        }


        @Get('')
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin', 'superAdmin','operator')
        @ApiOperation({ summary: 'Get all departments by siteId ' })
        getAllDepartmentsBySiteId(@Query('siteId') siteId?: string) {
          return this.departmentService.getAllDepartmentsBySiteId(siteId);
        }
    
        @Patch(':id')
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin', 'superAdmin','operator')
         @ApiOperation({ summary: 'edit department' })
         async updateDepartment(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateDepartmentDto: UpdateDepartmentDto) {
         return this.departmentService.updateDepartment(id, updateDepartmentDto);
        }
      
         @Delete(':id')
         @UseGuards(JwtAuthGuard, RolesGuard)
         @Roles('admin', 'superAdmin','operator')
         @ApiOperation({ summary: 'delete department' })
         deleteDepartment(@Param('id') id: string) {
             return this.departmentService.deleteDepartment(id);
        }
}
