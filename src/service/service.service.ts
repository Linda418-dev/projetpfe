import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from './repositories/service.repository';
import { CreateServiceDto } from './types/dto/create-service.dto';
import { UpdateServiceDto } from './types/dto/update-service.dto';
import { DepartmentRepository } from 'src/department/repositories/department.repository';

@Injectable()
export class ServiceService {
    constructor(
        private readonly serviceRepository: ServiceRepository,
        private readonly departmentRepository: DepartmentRepository
    ) {}

    async getAllServices() {
        return this.serviceRepository.find({ relations: ['department'] });
    }

    async getServiceById(id: string) {
        const fetchService = await this.serviceRepository.findOne({ where: { id }, relations: ['department'] });
        if (!fetchService) {
            throw new BadRequestException(`Service with id ${id} not found`);
        }
        return fetchService;
    }

    async createService(createServiceDto: CreateServiceDto) {
        const { name,serviceLocation, departmentId } = createServiceDto;

        
        const department = await this.departmentRepository.findOne({ where: { id: departmentId } });
        if (!department) {
            throw new NotFoundException(`Department with id ${departmentId} not found`);
        }

       
        const service = this.serviceRepository.create({
            name,
            serviceLocation,
            department, 
            departmentId 
        });

        return this.serviceRepository.save(service);
    }

    async updateService(id: string, updateServiceDto: UpdateServiceDto) {
        const fetchService = await this.getServiceById(id);
        if (!fetchService) {
            throw new BadRequestException(`Service with id ${id} not found`);
        }
        Object.assign(fetchService, updateServiceDto);
        return this.serviceRepository.save(fetchService);
    }

    async deleteService(id: string) {
        const result = await this.serviceRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Service not found');
        }
        return { message: 'Service deleted successfully' };
    }
}
