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
        const department = this.departmentRepository.create({
          name: createDepartmentDto.name,
          site: site,
        });
        const savedDepartment = await this.departmentRepository.save(department);
        const service = this.serviceRepository.create({
          name: savedDepartment.name,
          department: savedDepartment,
        });
        const savedService = await this.serviceRepository.save(service);
        const location = this.locationRepository.create({
          name: savedDepartment.name,
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
      async updateDepatment(id: string, updatedepartmentDto: UpdateDepartmentDto) {
        const fetchDepartment = await this.getDepartmentById(id);
        if (!fetchDepartment) {
          throw new BadRequestException(`Department with id ${id} not found`);
        }
        Object.assign(fetchDepartment, updatedepartmentDto);
        return this.departmentRepository.save(fetchDepartment);
      }

      // methode pour delete Department
      async deleteDepartment(id: string) {
        const fetchDepartment = await this.getDepartmentById(id);
        await this.departmentRepository.remove(fetchDepartment);
        return { message: 'Department deleted successfully' };
      }
}
