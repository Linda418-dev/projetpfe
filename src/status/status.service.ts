import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusRepository } from './repositories/status.repository';

@Injectable()
export class StatusService  { 
    constructor(private readonly statusRepository: StatusRepository) {}

    async getAllStatuses(){
      return await this.statusRepository.find();
    }
  
    async getStatusById(id: string){
      const status = await this.statusRepository.findOne({ where: { id } });
      if (!status) {
        throw new NotFoundException(`Status with ID ${id} not found`);
      }
      return status;
    }
}
