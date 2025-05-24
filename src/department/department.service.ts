import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentRepository } from './repositories/department.repository';
import { CreateDepartmentDto } from './types/dto/create-department.dto';
import { UpdateDepartmentDto } from './types/dto/update-department.dto';
import { SiteRepository } from 'src/site/Repositories/site.repository';
import { ServiceRepository } from 'src/service/repositories/service.repository';
import { LocationRepository } from 'src/location/repositories/location.repository';

@Injectable()
export class DepartmentService {
     constructor(private readonly departmentRepository : DepartmentRepository,
        private readonly siteRepository : SiteRepository,
        private readonly serviceRepository : ServiceRepository,
        private readonly  locationRepository : LocationRepository
        
      ){}
      // methode pour get All Departments 
      async getAllDepartments() {
        return this.departmentRepository.find({
          relations: ['site'],  
        });
      }
       // methode pour creation d'un department
      async createDepartment(createDepartmentDto: CreateDepartmentDto, siteId: string) {
  const site = await this.siteRepository.findOneBy({ id: siteId });
  if (!site) {
    throw new NotFoundException(`Site with id ${siteId} not found`);
  }

  const existingDepartment = await this.departmentRepository.findOne({
    where: { name: createDepartmentDto.name, site: { id: siteId } },
    relations: ['site'],
  });
  if (existingDepartment) {
    throw new BadRequestException(`Department '${createDepartmentDto.name}' already exists in this site.`);
  }

  // Créer le department
  const department = this.departmentRepository.create({
    name: createDepartmentDto.name,
    site,
  });
  const savedDepartment = await this.departmentRepository.save(department);

  //  Fonction interne pour générer un nom unique
  const generateUniqueName = async (baseName: string, repo: any): Promise<string> => {
    let name = baseName;
    let counter = 1;
    while (await repo.findOne({ where: { name } })) {
      name = `${baseName} (${counter++})`;
    }
    return name;
  };

  // Créer un service avec nom unique
  const serviceName = await generateUniqueName(`Service de ${savedDepartment.name}`, this.serviceRepository);
  const service = this.serviceRepository.create({
    name: serviceName,
    department: savedDepartment,
  });
  const savedService = await this.serviceRepository.save(service);

  // Créer une location avec nom unique
  const locationName = await generateUniqueName(`Location de ${savedDepartment.name}`, this.locationRepository);
  const location = this.locationRepository.create({
    name: locationName,
    service: savedService,
  });
  await this.locationRepository.save(location);

  return savedDepartment;
}


      
      // methode pour get department by id 
      async getDepartmentById(id: string) {
        const fetchDepartment = await this.departmentRepository.findOne({
          where: { id },       
          relations: ['site'], 
        });
        if (!fetchDepartment) {
            throw new BadRequestException(`Department with id ${id} not found`);
        }
    
        return fetchDepartment;
      }
     

      // methode pour update Department
      async updateDepartment(id: string, updateDepartmentDto: UpdateDepartmentDto) {
  const fetchDepartment = await this.getDepartmentById(id);
  if (!fetchDepartment) {
    throw new BadRequestException(`Department with id ${id} not found`);
  }

  // Vérifie s’il existe déjà un département avec le même nom dans le même site
  if (updateDepartmentDto.name && updateDepartmentDto.name !== fetchDepartment.name) {
    const existingDepartment = await this.departmentRepository.findOne({
      where: {
        name: updateDepartmentDto.name,
        site: { id: (fetchDepartment.site as any).id || fetchDepartment.site },
      },
      relations: ['site'],
    });

    if (existingDepartment && existingDepartment.id !== id) {
      throw new BadRequestException(
        `A department named '${updateDepartmentDto.name}' already exists in this site.`,
      );
    }
  }

  Object.assign(fetchDepartment, updateDepartmentDto);
  return this.departmentRepository.save(fetchDepartment);
}

      // methode pour delete Department
      async deleteDepartment(id: string) {
        const fetchDepartment = await this.getDepartmentById(id);
        await this.departmentRepository.remove(fetchDepartment);
        return { message: 'Department deleted successfully' };
      }
}
