import { Injectable, NotFoundException } from '@nestjs/common';
import { AnomalyRepository } from './Repositories/anomaly.repository';
import { AnomalyStatus } from './types/enums/anomaly-status.enum';

@Injectable()
export class AnomalyService {
    constructor (
        private readonly anomalyRepository : AnomalyRepository
    ){}
    
  async getAllanomalies(){
    return await this.anomalyRepository.find({ relations: ['inventoryDetail'] });
  }

  async getAnomalyById(id: string) {
    const anomaly = await this.anomalyRepository.findOne({
      where: { id },
      relations: ['inventoryDetail'],
    });

    if (!anomaly) {
      throw new NotFoundException(`Anomaly with ID ${id} not found`);
    }

    return anomaly;
  }

  
  async acceptAnomaly(id: string){
    const anomaly = await this.getAnomalyById(id);
    anomaly.status = AnomalyStatus.ACCEPTED;
    return await this.anomalyRepository.save(anomaly);
  }


}
