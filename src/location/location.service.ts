import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from './repositories/location.repository';
import { CreateLocationDto } from './types/dto/create-location.dto';
import { UpdateLocationDto } from './types/dto/update-location.dto';
import { ServiceRepository } from 'src/service/repositories/service.repository';

@Injectable()
export class LocationService {
    constructor(
            private readonly locationRepository: LocationRepository,
            private readonly serviceRepository : ServiceRepository
        ) {}


        async getAllLocationsByService(serviceId: string) {
    return this.locationRepository.findAllByService(serviceId);
  }

      // methode pour gett All locations
      async getAllLocations() {
        return this.locationRepository.find({
          relations: [
            'service',
            'service.department',
            'service.department.site',
          ],
        });
      }
          
      // methode pour creation location
      async createLocation(createLocationDto: CreateLocationDto, serviceId: string) {
        const service = await this.serviceRepository.findOneBy({ id: serviceId });
          if (!service) {
              throw new NotFoundException(`Service with id ${serviceId} not found`);
            }
           const existingLocation = await this.locationRepository.findOne({
            where: { name: createLocationDto.name, service: { id: serviceId } },
            relations: ['service'],
          });
          if (existingLocation) {
            throw new BadRequestException(`Location '${createLocationDto.name}' already exists in this service.`);
          }
          const location = this.locationRepository.create({
            name: createLocationDto.name,
            service: service,
          });
          return this.locationRepository.save(location);
        } 

      // methode get locations by id 
      async getLocationById(id: string) {
        const location = await this.locationRepository.findOne({
          where: { id },
          relations: [
            'service',
            'service.department',
            'service.department.site',
          ],
        });
        if (!location) {
          throw new BadRequestException(`Location with id ${id} not found`);
        }
        return location;
      }

      // methode pour modifier location
      async updateLocation(id: string, updateLocationDto: UpdateLocationDto) {
        const fetchLocation = await this.getLocationById(id);
        if (!fetchLocation) {
          throw new BadRequestException(`Location with id ${id} not found`);
        }
        // Vérifier si un autre location avec le même nom existe dans le même service
        if (updateLocationDto.name && updateLocationDto.name !== fetchLocation.name) {
          const existingLocation = await this.locationRepository.findOne({
            where: {
              name: updateLocationDto.name,
              service: { id: (fetchLocation.service as any).id || fetchLocation.service },             
            },
            relations: ['service'],
          });
          if (existingLocation && existingLocation.id !== id) {
            throw new BadRequestException(
              `A location named '${updateLocationDto.name}' already exists in this service.`,
            );
          }
        }
        Object.assign(fetchLocation, updateLocationDto);
        return this.locationRepository.save(fetchLocation);
      }


      // methode supprimer location
      async deleteLocation(id: string) {
        const result = await this.locationRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException('location not found');
        }
        return { message: 'location deleted successfully' };
      }
    
}
