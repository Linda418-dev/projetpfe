import { BadRequestException, Injectable } from '@nestjs/common';
import { SiteRepository } from './Repositories/site.repository';
import { CreateSiteDto } from './Types/dto/create-site.dto';
import { updateSiteDto } from './Types/dto/update-site.dto';
import { DepartmentRepository } from 'src/department/repositories/department.repository';
import { ServiceRepository } from 'src/service/repositories/service.repository';
import { LocationRepository } from 'src/location/repositories/location.repository';
import { CreateDepartmentDto } from 'src/department/types/dto/create-department.dto';
import { CreateServiceDto } from 'src/service/types/dto/create-service.dto';
import { CreateLocationDto } from 'src/location/types/dto/create-location.dto';

@Injectable()
export class SiteService {
     constructor(private readonly siteRepository:SiteRepository,
        private readonly departmentRepository: DepartmentRepository,
        private readonly serviceRepository : ServiceRepository,
        private readonly locationRepository : LocationRepository
     ){}
     
      //  methode pour get all sites 
        async getAllSites() {
            return this.siteRepository.findAll();
        }
        async createSite(createSiteDto: CreateSiteDto) {
          const site = await this.siteRepository.save(
            this.siteRepository.create({ name: createSiteDto.name })
          );
          const departments: CreateDepartmentDto[] = createSiteDto.department?.length
          ? createSiteDto.department
          : [{
            name: `Department_${site.name}`,
            services: [{
              name: `Service_${site.name}`,
              locations: [{ name: `Location_${site.name}` }]
        }]
      }];
      for (const deptDto of departments) {
        const department = await this.departmentRepository.save(
          this.departmentRepository.create({
            name: deptDto.name,
            site: site,
      })
    );
    const services: CreateServiceDto[] = deptDto.services?.length
      ? deptDto.services
      : [{
          name: `Service_${site.name}`,
          locations: [{ name: `Location_${site.name}` }]
        }];

    for (const servDto of services) {
      const service = await this.serviceRepository.save(
        this.serviceRepository.create({
          name: servDto.name,
          department: department,
        })
      );

      const locations: CreateLocationDto[] = servDto.locations?.length
        ? servDto.locations
        : [{ name: `Location_${site.name}` }];

      for (const locDto of locations) {
        await this.locationRepository.save(
          this.locationRepository.create({
            name: locDto.name,
            service: service,
          })
        );
      }
    }
  }

  return site;
}



        // methode pour get site by id
        async getSiteById(id: string) {
          const site = await this.siteRepository.findSiteWithRelationsById(id);
        
          if (!site) {
            throw new BadRequestException(`Site with id ${id} not found`);
          }
        
          return site;
        }
        // methode pour supprimer site
        async deleteSite(id: string) {
          const fetchSite = await this.getSiteById(id);
          await this.siteRepository.remove(fetchSite);
          return { message: 'Site deleted successfully' };
        }
          
        // methode pour update Site 
        async updateSite(id: string, updateSiteDto: updateSiteDto) {
          const fetchSite = await this.getSiteById(id);
          if (!fetchSite) {
            throw new BadRequestException(`Site with id ${id} not found`);
          }
          Object.assign(fetchSite, updateSiteDto);
          return this.siteRepository.save(fetchSite);
        }          
}
