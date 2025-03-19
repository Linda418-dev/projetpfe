import { BadRequestException, Injectable } from '@nestjs/common';
import { SupplierRepository } from './Repositories/Supplier.repository';
import { CreateSupplierDto } from './types/dto/create-supplier.dto';
import { UpdateSupplierDto } from './types/dto/update-supplier.dto';

@Injectable()
export class SupplierService {
     constructor(private readonly supplierRepository:SupplierRepository){}
        async getAllSuppliers () {
            return this.supplierRepository.find();
        }
        async getSupplierById(id: string) {
           const fetchSupplier= await this.supplierRepository.findOneBy({id : id });
           if (!fetchSupplier){
            throw new BadRequestException('Supplier with id ${id} not found');
           }
           return fetchSupplier;
        }
        async  CreateSupplier(createSupplierDto: CreateSupplierDto) {
            return this.supplierRepository.save(
                this.supplierRepository.create(createSupplierDto)
            )
        }
    
        async deleteSupplier(id: string) {
           const fetchSupplier = await this.getSupplierById(id);
           return this.supplierRepository.remove(fetchSupplier);
        }
        async  updateSupplier(id: string, updateSupplierDto: UpdateSupplierDto) {
            const fetchSupplier = await this.getSupplierById(id);
            if (!fetchSupplier) {
                throw new BadRequestException(`Supplier with id ${id} not found`);
            }
            Object.assign(fetchSupplier, updateSupplierDto);
            return this.supplierRepository.save(fetchSupplier);
        }
       
}
