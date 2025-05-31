import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from './repositories/service.repository';
import { CreateServiceDto } from './types/dto/create-service.dto';
import { UpdateServiceDto } from './types/dto/update-service.dto';
import { DepartmentRepository } from 'src/department/repositories/department.repository';
import { LocationRepository } from 'src/location/repositories/location.repository';

@Injectable()
export class ServiceService {
    constructor(
        private readonly serviceRepository: ServiceRepository,
        private readonly departmentRepository : DepartmentRepository,
        private readonly locationRepository : LocationRepository
    ) {}

  async getAllServicesByDepartment( departmentId: string) {
    return this.serviceRepository.findAllByDepartmentAndSite(departmentId);
  }


    // methode pour get All Services 
    async getAllServices() {
     return this.serviceRepository.find({
      relations: ['department', 'department.site'],
    });

      }
      
    // methode pour creation d'un service 
async createService(createServiceDto: CreateServiceDto, departmentId: string) {
  const department = await this.departmentRepository.findOneBy({ id: departmentId });
  if (!department) {
    throw new NotFoundException(`Department with id ${departmentId} not found`);
  }
 const existingService = await this.serviceRepository.findOne({
    where: { name: createServiceDto.name, department: { id: departmentId } },
    relations: ['department'],
  });

  if (existingService) {
    throw new BadRequestException(`Service '${createServiceDto.name}' already exists in this department.`);
  }
  // Fonction interne pour nom unique de service dans un département
  const generateUniqueServiceName = async (baseName: string): Promise<string> => {
    let name = baseName;
    let counter = 1;
    while (await this.serviceRepository.findOne({ where: { name, department: { id: departmentId } } })) {
      name = `${baseName} (${counter++})`;
    }
    return name;
  };

  // Fonction interne pour nom unique de location dans un service
  const generateUniqueLocationName = async (baseName: string, serviceId: string): Promise<string> => {
    let name = baseName;
    let counter = 1;
    while (await this.locationRepository.findOne({ where: { name, service: { id: serviceId } } })) {
      name = `${baseName} (${counter++})`;
    }
    return name;
  };

  // Générer nom unique pour le service
  const uniqueServiceName = await generateUniqueServiceName(createServiceDto.name);
  const service = this.serviceRepository.create({
    name: uniqueServiceName,
    department: department,
  });
  const savedService = await this.serviceRepository.save(service);

  // Générer nom unique pour la location par défaut
  const baseLocationName = `Location de ${uniqueServiceName}`;
  const uniqueLocationName = await generateUniqueLocationName(baseLocationName, savedService.id);
  const defaultLocation = this.locationRepository.create({
    name: uniqueLocationName,
    service: savedService,
  });
  await this.locationRepository.save(defaultLocation);

  return savedService;
}

      
    // methode pour le get service by id
    async getServiceById(id: string) {
     const service = await this.serviceRepository.findOne({
    where: { id },
    relations: ['department', 'department.site'],
  });
      
        if (!service) {
          throw new BadRequestException(`Service with id ${id} not found`);
        }
      
        return service;
      }
    // methode pour modifier service  
   async updateService(id: string, updateServiceDto: UpdateServiceDto) {
  const fetchService = await this.getServiceById(id);
  if (!fetchService) {
    throw new BadRequestException(`Service with id ${id} not found`);
  }

  // Vérification de duplication si le nom change
  if (updateServiceDto.name && updateServiceDto.name !== fetchService.name) {
    const existingService = await this.serviceRepository.findOne({
      where: {
        name: updateServiceDto.name,
        department: { id: (fetchService.department as any).id || fetchService.department },
      },
      relations: ['department'],
    });

    if (existingService && existingService.id !== id) {
      throw new BadRequestException(
        `A service named '${updateServiceDto.name}' already exists in this department.`,
      );
    }
  }

  Object.assign(fetchService, updateServiceDto);
  return this.serviceRepository.save(fetchService);
}

    
    // methode pour supprimer service
    async deleteService(id: string) {
        const result = await this.serviceRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Service not found');
        }
        return { message: 'Service deleted successfully' };
    }
}
