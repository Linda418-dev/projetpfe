import { BadRequestException, Injectable, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { PlaceRepository } from './Repositories/Place.repository';
import { CreatePlaceDto } from './Types/dto/create-place.dto';
import { updatePlaceDto } from './Types/dto/update-place.dto';

@Injectable()
export class PlacesService {
    constructor(private readonly placeRepository:PlaceRepository){}
    async getAllPlaces() {
        return this.placeRepository.find({ relations: ['departments'] });
    }
    
    async getAllPlacesNames() {
        const places = await this.placeRepository.find({ select: ['name'] });
        return places.map(place => place.name);
      }
      async getPlaceById(id: string) {
        const fetchPlace = await this.placeRepository.findOne({
            where: { id },
            relations: ['departments'],
        });
    
        if (!fetchPlace) {
            throw new BadRequestException(`Place with id ${id} not found`);
        }
        
        return fetchPlace;
    }
    
    async  CreatePlace(createPlaceDto: CreatePlaceDto) {
        return this.placeRepository.save(
            this.placeRepository.create(createPlaceDto)
        )
    }

    async deletePlace(id: string) {
       const fetchPlace = await this.getPlaceById(id);
       return this.placeRepository.remove(fetchPlace);
    }
    async  updateplace(id: string, updatePlaceDto: updatePlaceDto) {
        const fetchPlace = await this.getPlaceById(id);
        if (!fetchPlace) {
            throw new BadRequestException(`Place with id ${id} not found`);
        }
        Object.assign(fetchPlace, updatePlaceDto);
        return this.placeRepository.save(fetchPlace);
    }
}
