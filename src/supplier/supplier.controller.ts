import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './types/dto/create-supplier.dto';
import { UpdateSupplierDto } from './types/dto/update-supplier.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Supplier ressource')
@Controller('supplier')
export class SupplierController {
    constructor(private readonly supplierService:SupplierService){}
        @Get()
        async getAllSuppliers(){
            return this .supplierService.getAllSuppliers();
        }
        @Get('names')
        async getAllSuppliersNames(): Promise<string[]> {
          return this.supplierService.getAllSuppliersNames();
        }
        @Get(':id')
        async getSupplierById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.supplierService.getSupplierById(id); 
        }
    
        @Post()
        async CreateSupplier(@Body() createSupplierDto : CreateSupplierDto ){
            return this.supplierService.CreateSupplier(createSupplierDto);
        }
    
        @Delete(':id')
        async deleteSupplier(@Param('id',new ParseUUIDPipe()) id : string){
            return this.supplierService.deleteSupplier(id);
        }
        @Patch(':id')
        async updateSupplier(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateSuplierDto: UpdateSupplierDto) {
        return this.supplierService.updateSupplier(id, updateSuplierDto);
        }

    
    
    
}
