import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './types/dto/create-supplier.dto';
import { UpdateSupplierDto } from './types/dto/update-supplier.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Supplier Resource')
@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService:SupplierService){}

        @Get()
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin', 'superAdmin','operator')
        @ApiOperation({ summary: 'get all suppliers' })
        async getAllSuppliers(){
            return this .supplierService.getAllSuppliers();
        }

        @Post()
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin', 'superAdmin','operator')
        @ApiOperation({ summary: 'create supplier' })
        async CreateSupplier(@Body() createSupplierDto : CreateSupplierDto ){
            return this.supplierService.CreateSupplier(createSupplierDto);
        }
    
        @Get(':id')
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin', 'superAdmin','operator')
        @ApiOperation({ summary: 'get supplier by id ' })
        async getSupplierById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.supplierService.getSupplierById(id); 
        }
    
        @Patch(':id')
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin', 'superAdmin','operator')
        @ApiOperation({ summary: 'edit supplier' })
        async updateSupplier(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateSuplierDto: UpdateSupplierDto) {
        return this.supplierService.updateSupplier(id, updateSuplierDto);
        }

        @Delete(':id')
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin', 'superAdmin','operator')
        @ApiOperation({ summary: 'delete  supplier' })
        async deleteSupplier(@Param('id',new ParseUUIDPipe()) id : string){
            return this.supplierService.deleteSupplier(id);
        }

        @Get('/by-site/:siteId')
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin', 'superAdmin','operator')
        @ApiOperation({ summary: 'get suppliers by site' })
        async getSuppliersBySite(@Param('siteId', new ParseUUIDPipe()) siteId: string) {
            return this.supplierService.getSuppliersBySite(siteId);
        }

    
}
