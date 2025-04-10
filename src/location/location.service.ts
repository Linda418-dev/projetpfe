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
    
        async getAllLocations() {
            return this.locationRepository.find({
              relations: {
                service: {
                  department: {
                    site: true
                  }
                }
              }
            });
          }
    
          async getLocationById(id: string) {
            const location = await this.locationRepository.findOne({
              where: { id },
              relations: {
                service: {
                  department: {
                    site: true
                  }
                }
              }
            });
          
            if (!location) {
              throw new BadRequestException(`Location with id ${id} not found`);
            }
          
            return location;
          }
    
    
          async createLocation(createLocationDto: CreateLocationDto, serviceId: string) {
            const service = await this.serviceRepository.findOneBy({ id: serviceId });
          
            if (!service) {
              throw new NotFoundException(`Service with id ${serviceId} not found`);
            }
          
            const location = this.locationRepository.create({
              name: createLocationDto.name,
              service: service,
            });
          
            return this.locationRepository.save(location);
          }
          
              
    
        async updateLocation(id: string, updatelocationDto: UpdateLocationDto) {
            const fetchLocation = await this.getLocationById(id);
            if (!fetchLocation) {
                throw new BadRequestException(`location with id ${id} not found`);
            }
            Object.assign(fetchLocation, updatelocationDto);
            return this.locationRepository.save(fetchLocation);
        }
    
        async deleteLocation(id: string) {
            const result = await this.locationRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('location not found');
            }
            return { message: 'location deleted successfully' };
        }
    
}
