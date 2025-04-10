import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './types/dto/create-department.dto';
import { UpdateDepartmentDto } from './types/dto/update-department.dto';


@ApiTags('Department Resource')
@Controller('departments')
export class DepartmentController {
   
    constructor(private readonly departmentService: DepartmentService) {}
          
         @Get()
         @ApiOperation({ summary: 'get all departments' })
         getAllDepartments() {
             return this.departmentService.getAllDepartments();
         }
    
         @Post()
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
         @ApiOperation({ summary: 'get department by id' })
         getDepartmentById(@Param('id') id: string) {
             return this.departmentService.getDepartmentById(id);
         }
    
         @Patch(':id')
         @ApiOperation({ summary: 'edit department' })
         async updateDepatment(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateDepartmentDto: UpdateDepartmentDto) {
         return this.departmentService.updateDepatment(id, updateDepartmentDto);
             }
      
         @Delete(':id')
         @ApiOperation({ summary: 'delete department' })
         deleteDepartment(@Param('id') id: string) {
             return this.departmentService.deleteDepartment(id);
         }
}
