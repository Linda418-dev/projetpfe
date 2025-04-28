import { Injectable, NotFoundException } from '@nestjs/common';
import { AnomalyRepository } from './Repositories/anomaly.repository';
import { AnomalyStatus } from './types/enums/anomaly-status.enum';
import { CreateAnomalyDto } from './types/dto/create-anomaly.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { File } from 'src/uploads/entities/file.entity';
import { InventoryDetailsRepository } from 'src/inventory-details/repositories/inventory-details.repository';
import { InventoryDetails } from 'src/inventory-details/entities/inventory-details.entity';

@Injectable()
export class AnomalyService {
    constructor (
        private readonly anomalyRepository : AnomalyRepository,
        private readonly fileRepository : FileRepository,
        private readonly inventoryDetailRepository : InventoryDetailsRepository
    ){}
    
  async getAllanomalies(){
    return await this.anomalyRepository.find({ relations: ['inventoryDetail'] });
  }

  async createAnomaly(createAnomalyDto: CreateAnomalyDto) {
    const { description, fileIds, inventoryDetailId } = createAnomalyDto;
  
    let files: File[] = [];
    if (fileIds && fileIds.length > 0) {
      files = await this.fileRepository.findByIds(fileIds);
  
      if (files.length !== fileIds.length) {
        throw new NotFoundException('One or more fileIds are invalid');
      }
    }
  
    let inventoryDetail: InventoryDetails | null = null;  
    if (inventoryDetailId) {
      inventoryDetail = await this.inventoryDetailRepository.findOne({
        where: { id: inventoryDetailId },
      });
  
      if (!inventoryDetail) {
        throw new NotFoundException(`InventoryDetail with ID ${inventoryDetailId} not found`);
      }
    }
  
    const anomaly = this.anomalyRepository.create({
      description,
      status: AnomalyStatus.PENDING,
      inventoryDetail: inventoryDetail ?? undefined,
    });
  
    const savedAnomaly = await this.anomalyRepository.save(anomaly);
  
    if (files.length > 0) {
      for (const file of files) {
        file.anomaly = savedAnomaly;
        await this.fileRepository.save(file);
      }
    }
  
    return savedAnomaly;
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
