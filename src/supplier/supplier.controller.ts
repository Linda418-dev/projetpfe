import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './types/dto/create-supplier.dto';
import { UpdateSupplierDto } from './types/dto/update-supplier.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Supplier Resource')
@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService:SupplierService){}

        @Get()
        @ApiOperation({ summary: 'get all suppliers' })
        async getAllSuppliers(){
            return this .supplierService.getAllSuppliers();
        }

        @Post()
        @ApiOperation({ summary: 'create supplier' })
        async CreateSupplier(@Body() createSupplierDto : CreateSupplierDto ){
            return this.supplierService.CreateSupplier(createSupplierDto);
        }
    
        @Get(':id')
        @ApiOperation({ summary: 'get supplier by id ' })
        async getSupplierById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.supplierService.getSupplierById(id); 
        }
    
        @Patch(':id')
        @ApiOperation({ summary: 'edit supplier' })
        async updateSupplier(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateSuplierDto: UpdateSupplierDto) {
        return this.supplierService.updateSupplier(id, updateSuplierDto);
        }

        @Delete(':id')
        @ApiOperation({ summary: 'delete  supplier' })
        async deleteSupplier(@Param('id',new ParseUUIDPipe()) id : string){
            return this.supplierService.deleteSupplier(id);
        }

        @Get('/by-site/:siteId')
        @ApiOperation({ summary: 'get suppliers by site' })
        async getSuppliersBySite(@Param('siteId', new ParseUUIDPipe()) siteId: string) {
            return this.supplierService.getSuppliersBySite(siteId);
        }

    
}
