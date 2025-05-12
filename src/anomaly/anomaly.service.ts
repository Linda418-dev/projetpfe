import { Injectable, NotFoundException } from '@nestjs/common';
import { AnomalyRepository } from './Repositories/anomaly.repository';
import { CreateAnomalyDto } from './types/dto/create-anomaly.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { File } from 'src/uploads/entities/file.entity';
import { AnomalyStatusEnum } from 'src/status/types/enums/anomaly-status.enum';
import { AnomalyStatusRepository } from 'src/anomaly-status/repositories/anomaly-status.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';


@Injectable()
export class AnomalyService {
    constructor (
        private readonly anomalyRepository : AnomalyRepository,
        private readonly fileRepository : FileRepository,
        private readonly statusRepository : StatusRepository,
        private readonly anomalyStatusRepository : AnomalyStatusRepository,
        private readonly assetRepository : AssetRepository
    ){}
    async getAllAnomalies() {
      const anomalies = await this.anomalyRepository.find({
        relations: ['files'],
      });
    
      for (const anomaly of anomalies) {
        const lastStatus = await this.anomalyStatusRepository.findOne({
          where: { anomaly: { id: anomaly.id } },
          relations: ['status'],
          order: { createdAt: 'DESC' },
        });
    
        (anomaly as any).latestStatus = lastStatus?.status;
      }
    
      return anomalies;
    }
    
    
    async createAnomaly(createAnomalyDto: CreateAnomalyDto) {
      const { description, fileIds, assetId } = createAnomalyDto;
    
      // Étape 1 : Vérifier que le statut 'pending' existe AVANT toute insertion
      const pendingStatus = await this.statusRepository.findOne({
        where: { name: 'pending', type: 'anomaly' },
      });
    
      if (!pendingStatus) {
        throw new NotFoundException("Default 'pending' status not found for anomaly");
      }
    
      // Étape 2 : Charger les fichiers
      let files: File[] = [];
      if (fileIds && fileIds.length > 0) {
        files = await this.fileRepository.findByIds(fileIds);
        if (files.length !== fileIds.length) {
          throw new NotFoundException('One or more fileIds are invalid');
        }
      }
    
      // Étape 3 : Créer l’anomalie
      const anomaly = this.anomalyRepository.create({ description });
      const savedAnomaly = await this.anomalyRepository.save(anomaly);
    
      // Étape 4 : Associer les fichiers
      if (files.length > 0) {
        for (const file of files) {
          file.anomaly = savedAnomaly;
         
          await this.fileRepository.save(file);
        }
      }
    
      // Étape 5 : Créer l’entrée dans AnomalyStatus
      const anomalyStatus = this.anomalyStatusRepository.create({
        anomaly: savedAnomaly,
        status: pendingStatus,
      });
      await this.anomalyStatusRepository.save(anomalyStatus);
    
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
    
      // récupérer le dernier statut selon le createdAt
      const lastStatus = await this.anomalyStatusRepository.findOne({
        where: { anomaly: { id } },
        relations: ['status'],
        order: { createdAt: 'DESC' },
      });
    
      return {
        ...anomaly,
        latestStatus: lastStatus?.status, 
      };
    }
    

  async progressAnomaly(anomalyId: string) {
    // vérifier si l'anomalie existe
    const anomaly = await this.anomalyRepository.findOne({ where: { id: anomalyId } });
    if (!anomaly) {
      throw new NotFoundException('Anomaly not found');
    }
  
    // Chercher le statut 'in_progress' de type 'anomaly'
    const inProgressStatus = await this.statusRepository.findOne({
      where: { name: 'in_progress', type: 'anomaly' },
    });
  
    if (!inProgressStatus) {
      throw new NotFoundException("Status 'in_progress' not found for anomaly");
    }
  
    // Créer le nouveau  status dans  AnomalyStatus
    const anomalyStatus = this.anomalyStatusRepository.create({
      anomaly,
      status: inProgressStatus,
    });
  
    await this.anomalyStatusRepository.save(anomalyStatus);
  
    return {
      message: 'Anomaly status updated to in_progress',
      status: inProgressStatus,
      anomaly,
    };
  }
  

  async acceptAnomaly(anomalyId: string) {
    // vérifier si l'anomalie existe
    const anomaly = await this.anomalyRepository.findOne({ where: { id: anomalyId } });
    if (!anomaly) {
      throw new NotFoundException('Anomaly not found');
    }
  
    // Chercher le statut 'accepted' de type 'anomaly'
    const acceptedStatus = await this.statusRepository.findOne({
      where: { name: 'accepted', type: 'anomaly' },
    });
  
    if (!acceptedStatus) {
      throw new NotFoundException("Status 'accepted' not found for anomaly");
    }
  
   // Créer le nouveau  status dans  AnomalyStatus
    const anomalyStatus = this.anomalyStatusRepository.create({
      anomaly,
      status: acceptedStatus,
    });
  
    await this.anomalyStatusRepository.save(anomalyStatus);
  
    return {
      message: 'Anomaly status updated to accepted',
      status: acceptedStatus,
      anomaly,
    };
  }
  

  async refuseAnomaly(anomalyId: string) {
    // vérifier si l'anomalie existe
    const anomaly = await this.anomalyRepository.findOne({ where: { id: anomalyId } });
    if (!anomaly) {
      throw new NotFoundException('Anomaly not found');
    }
  
    // Chercher le statut 'refused' de type 'anomaly'
    const refusedStatus = await this.statusRepository.findOne({
      where: { name: 'refused', type: 'anomaly' },
    });
  
    if (!refusedStatus) {
      throw new NotFoundException("Status 'refused' not found for anomaly");
    }
  
    // Créer le nouveau  status dans  AnomalyStatus
    const anomalyStatus = this.anomalyStatusRepository.create({
      anomaly,
      status: refusedStatus,
    });
  
    await this.anomalyStatusRepository.save(anomalyStatus);
  
    return {
      message: 'Anomaly status updated to refused',
      status: refusedStatus,
      anomaly,
    };
  }
  

  
}
