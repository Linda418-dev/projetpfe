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
        
        // methode pour le creation d'un site
        async createSite(createSiteDto: CreateSiteDto) {
          //créer le site
          const site = await this.siteRepository.save(
            this.siteRepository.create({ name: createSiteDto.name })
          );
        
          // si aucun département doit  crée un département par défaut
          const departments: CreateDepartmentDto[] = createSiteDto.department?.length
            ? createSiteDto.department
            : [{ name: site.name }];
        
          for (const deptDto of departments) {
            //créer le département et lier au site
            const department = await this.departmentRepository.save(
              this.departmentRepository.create({
                name: deptDto.name,
                site: site,
              })
            );
        
            //créer les services et les locations imbriquées
            const services: CreateServiceDto[] = deptDto.services?.length
              ? deptDto.services
              : [{ name: department.name }]; 
        
            for (const servDto of services) {
              const service = await this.serviceRepository.save(
                this.serviceRepository.create({
                  name: servDto.name,
                  department: department,  
                })
              );
        
              // créer les locations et lier au service
              const locations: CreateLocationDto[] = servDto.locations?.length
                ? servDto.locations
                : [{ name: service.name }]; 
        
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
        async getSiteById(id: string) {
          const site = await this.siteRepository.findSiteWithRelationsById(id);
        
          if (!site) {
            throw new BadRequestException(`Site with id ${id} not found`);
          }
        
          return site;
        }

          async deleteSite(id: string) {
            const fetchSite = await this.getSiteById(id);
            await this.siteRepository.remove(fetchSite);
            return { message: 'Site deleted successfully' };
          }
          
          async updateSite(id: string, updateSiteDto: updateSiteDto) {
            const fetchSite = await this.getSiteById(id);
            if (!fetchSite) {
              throw new BadRequestException(`Site with id ${id} not found`);
            }
            Object.assign(fetchSite, updateSiteDto);
            return this.siteRepository.save(fetchSite);
          }          
}
