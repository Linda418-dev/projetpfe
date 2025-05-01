import { Injectable, NotFoundException } from '@nestjs/common';
import { AnomalyRepository } from './Repositories/anomaly.repository';
import { AnomalyStatus } from './types/enums/anomaly-status.enum';
import { CreateAnomalyDto } from './types/dto/create-anomaly.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { File } from 'src/uploads/entities/file.entity';

@Injectable()
export class AnomalyService {
    constructor (
        private readonly anomalyRepository : AnomalyRepository,
        private readonly fileRepository : FileRepository,
    ){}


    async getAllanomalies() {
      return await this.anomalyRepository.find({
        relations: ['files'],
      });
    }
    
  async createAnomaly(createAnomalyDto: CreateAnomalyDto) {
    const { description, fileIds , assetId } = createAnomalyDto;

    let files: File[] = [];
    if (fileIds && fileIds.length > 0) {
      files = await this.fileRepository.findByIds(fileIds);
  
      if (files.length !== fileIds.length) {
        throw new NotFoundException('One or more fileIds are invalid');
      }
    }
  
    const anomaly = this.anomalyRepository.create({
      description,
      status: AnomalyStatus.PENDING,
    });
  
    const savedAnomaly = await this.anomalyRepository.save(anomaly);
  
    if (files.length > 0) {
      for (const file of files) {
        file.anomaly = savedAnomaly;

        if (assetId) {
          file.assetId = assetId;
        }

        await this.fileRepository.save(file);
      }
    }
  
    return savedAnomaly;
  }
  
  async getAnomalyById(id: string) {
    const anomaly = await this.anomalyRepository.findOne({
      where: { id },
      relations: ['files'],
    });

    if (!anomaly) {
      throw new NotFoundException(`Anomaly with ID ${id} not found`);
    }

    return anomaly;
  }

  async progressAnomaly(id: string){
    const anomaly = await this.getAnomalyById(id);
    anomaly.status = AnomalyStatus.IN_PROGRESS;
    return await this.anomalyRepository.save(anomaly);
  }

  async acceptAnomaly(id: string){
    const anomaly = await this.getAnomalyById(id);
    anomaly.status = AnomalyStatus.ACCEPTED;
    return await this.anomalyRepository.save(anomaly);
  }

   async refuseAnomaly(id: string) {
    const anomaly = await this.getAnomalyById(id);
    anomaly.status = AnomalyStatus.REFUSED;
    await this.anomalyRepository.save(anomaly);
  }
  
}
