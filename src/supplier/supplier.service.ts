import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SupplierRepository } from './Repositories/Supplier.repository';
import { CreateSupplierDto } from './types/dto/create-supplier.dto';
import { UpdateSupplierDto } from './types/dto/update-supplier.dto';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';

@Injectable()
export class SupplierService {
     constructor(private readonly supplierRepository:SupplierRepository,
        private readonly assetRepository : AssetRepository, 
        private readonly siteRepository : SiteRepository
     ){}

    //  methode pour get All Suppliers
      async getAllSuppliers () {
        return this.supplierRepository.find();
      }

    //  methode pour creation suplier 
      async  CreateSupplier(createSupplierDto: CreateSupplierDto) {
        const {name ,email , phone , siteId } =  createSupplierDto ;
        const site = await this.siteRepository.findOneBy({ id: siteId });
        if (!site) throw new NotFoundException(`Site with ID ${siteId} not found`);

        const Supplier =  this.supplierRepository.create({
          name,
          email,
          phone,
          site,
        });
        return this.supplierRepository.save(Supplier);
      }

    //  methode pour get supplier by id 
      async getSupplierById(id: string) {
        const fetchSupplier= await this.supplierRepository.findOneBy({id : id });
           if (!fetchSupplier){
            throw new BadRequestException('Supplier with id ${id} not found');
           }
           return fetchSupplier;
      }
    // methode supprimer supprimer 
    async deleteSupplier(id: string) {
      const supplier = await this.supplierRepository.findOne({
        where: { id },
        relations: ['assets'],
      });
    
      if (!supplier) {
        throw new NotFoundException('Supplier not found');
      }
    
      if (supplier.assets.length > 0) {
        throw new BadRequestException('Cannot delete supplier, it is associated with assets');
      }
    
      await this.supplierRepository.remove(supplier);
      return { message: 'Supplier deleted successfully' };
    }
    
    // methode pour modifier supplier
      async updateSupplier(id: string, updateSupplierDto: UpdateSupplierDto) {
        const fetchSupplier = await this.supplierRepository.findOne({
              where: { id },
              relations: ['assets'], 
            });
          if (!fetchSupplier) {
              throw new BadRequestException(`Supplier with id ${id} not found`);
            }
          const oldSupplierName = fetchSupplier.name;
          Object.assign(fetchSupplier, updateSupplierDto);
          const updatedSupplier = await this.supplierRepository.save(fetchSupplier);
          const updatedAssets = await this.assetRepository.find({
              where: { supplier: updatedSupplier },
            });
          
            return {
              message: 'Supplier updated successfully',
              supplier: updatedSupplier,
              assets: updatedAssets,
            };
          }


          async getSuppliersBySite(siteId: string) {
            return this.supplierRepository.find({
              where: { site: { id: siteId } },
              relations: ['site'],
            });
          }

          
}
