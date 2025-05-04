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
    // methode pour get All Services 
    async getAllServices() {
      return this.serviceRepository.find({
        relations: {
            department: {
              site: true, 
            },
          },
        });
      }
    // methode pour creation d'un service 
    async createService(createServiceDto: CreateServiceDto, departmentId: string) {
      const department = await this.departmentRepository.findOneBy({ id: departmentId });
      if (!department) {
        throw new NotFoundException(`Department with id ${departmentId} not found`);
      }
      const service = this.serviceRepository.create({
        name: createServiceDto.name,
        department: department,
      });
      const savedService = await this.serviceRepository.save(service);
      const defaultLocation = this.locationRepository.create({
        name: savedService.name,
        service: savedService,
      });
      await this.locationRepository.save(defaultLocation);
      return savedService;
    }
      
    // methode pour le get service by id
    async getServiceById(id: string) {
      const service = await this.serviceRepository.findOne({
          where: { id },
          relations: {
            department: {
              site: true,
            },
          },
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
