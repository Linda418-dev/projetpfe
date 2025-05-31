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

  async CreateSupplier(createSupplierDto: CreateSupplierDto) {
  const { name, email, phone, siteId } = createSupplierDto;
  
  // Vérifier que le site existe
  const site = await this.siteRepository.findOneBy({ id: siteId });
  if (!site) throw new NotFoundException(`Site with ID ${siteId} not found`);

  // Vérifier si un Supplier avec ce nom existe déjà sur ce site
  const existingByName = await this.supplierRepository.findOne({
    where: { name, site: { id: siteId } },
  });
  if (existingByName) {
    throw new BadRequestException(`Supplier with name '${name}' already exists for this site.`);
  }

  // Vérifier si un Supplier avec cet email existe déjà sur ce site
  const existingByEmail = await this.supplierRepository.findOne({
    where: { email, site: { id: siteId } },
  });
  if (existingByEmail) {
    throw new BadRequestException(`Supplier with email '${email}' already exists for this site.`);
  }

  // Vérifier si un Supplier avec ce téléphone existe déjà sur ce site
  const existingByPhone = await this.supplierRepository.findOne({
    where: { phone, site: { id: siteId } },
  });
  if (existingByPhone) {
    throw new BadRequestException(`Supplier with phone '${phone}' already exists for this site.`);
  }

  const supplier = this.supplierRepository.create({
    name,
    email,
    phone,
    site,
  });

  return this.supplierRepository.save(supplier);
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
    
   async updateSupplier(id: string, updateSupplierDto: UpdateSupplierDto) {
  const fetchSupplier = await this.supplierRepository.findOne({
    where: { id },
    relations: ['assets', 'site'],
  });

  if (!fetchSupplier) {
    throw new BadRequestException(`Supplier with id ${id} not found`);
  }

  // Si le siteId change, on met à jour le site
  if (updateSupplierDto.siteId && updateSupplierDto.siteId !== (fetchSupplier.site as any).id) {
    const newSite = await this.siteRepository.findOneBy({ id: updateSupplierDto.siteId });
    if (!newSite) {
      throw new BadRequestException(`Site with id ${updateSupplierDto.siteId} not found`);
    }
    fetchSupplier.site = newSite;
  }

  const siteId = (fetchSupplier.site as any).id;

  // Vérification de l'unicité du nom
  if (updateSupplierDto.name && updateSupplierDto.name !== fetchSupplier.name) {
    const existingByName = await this.supplierRepository.findOne({
      where: {
        name: updateSupplierDto.name,
        site: { id: siteId },
      },
    });
    if (existingByName && existingByName.id !== fetchSupplier.id) {
      throw new BadRequestException(`A supplier with name '${updateSupplierDto.name}' already exists for this site.`);
    }
  }

  // Vérification de l'unicité de l'email
  if (updateSupplierDto.email && updateSupplierDto.email !== fetchSupplier.email) {
    const existingByEmail = await this.supplierRepository.findOne({
      where: {
        email: updateSupplierDto.email,
        site: { id: siteId },
      },
    });
    if (existingByEmail && existingByEmail.id !== fetchSupplier.id) {
      throw new BadRequestException(`A supplier with email '${updateSupplierDto.email}' already exists for this site.`);
    }
  }

  // Vérification de l'unicité du téléphone
  if (updateSupplierDto.phone && updateSupplierDto.phone !== fetchSupplier.phone) {
    const existingByPhone = await this.supplierRepository.findOne({
      where: {
        phone: updateSupplierDto.phone,
        site: { id: siteId },
      },
    });
    if (existingByPhone && existingByPhone.id !== fetchSupplier.id) {
      throw new BadRequestException(`A supplier with phone '${updateSupplierDto.phone}' already exists for this site.`);
    }
  }

  // On applique les modifications restantes
  const { siteId: _, ...otherUpdates } = updateSupplierDto;
  Object.assign(fetchSupplier, otherUpdates);

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
