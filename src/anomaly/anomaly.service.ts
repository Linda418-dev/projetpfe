import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AnomalyRepository } from './Repositories/anomaly.repository';
import { CreateAnomalyDto } from './types/dto/create-anomaly.dto';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { File } from 'src/uploads/entities/file.entity';
import { AnomalyStatusRepository } from 'src/anomaly-status/repositories/anomaly-status.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { User } from 'src/user/entities/user.entity';
import { IUser } from 'src/user/types/interface/user.interface';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { Asset } from 'src/assets/Entities/asset.entity';


@Injectable()
export class AnomalyService {
    constructor (
        private readonly anomalyRepository : AnomalyRepository,
        private readonly fileRepository : FileRepository,
        private readonly statusRepository : StatusRepository,
        private readonly anomalyStatusRepository : AnomalyStatusRepository,
        private readonly assetRepository: AssetRepository,
    ){}
 async getAllAnomalies(currentUser: User) {
  let anomalies;

  const userRole = typeof currentUser.role === 'string'
    ? currentUser.role
    : currentUser.role?.role;

  if (userRole === 'admin') {
    anomalies = await this.anomalyRepository.find({
relations: [
  'files',
  'statusHistory',
  'statusHistory.status',
  'operator',
  'asset',
  'asset.location',
  'asset.location.service',
  'asset.location.service.department',
  'asset.location.service.department.site',
],
      order: {
        createdAt: 'DESC',
      },
    });
  } else if (userRole === 'operator') {
    anomalies = await this.anomalyRepository.find({
      where: { operator: { id: currentUser.id } },
relations: [
  'files',
  'statusHistory',
  'statusHistory.status',
  'operator',
  'asset',
  'asset.location',
  'asset.location.service',
  'asset.location.service.department',
  'asset.location.service.department.site',
],
      order: {
        createdAt: 'DESC',
      },
    });
  } else {
    throw new UnauthorizedException('Rôle non autorisé');
  }

  return anomalies.map(anomaly => {
    const latestStatus = Array.isArray(anomaly.statusHistory)
      ? anomaly.statusHistory[0]?.status ?? null
      : null;

    const site = anomaly.asset?.location?.['service']?.['department']?.['site'];
  

    return {
      ...anomaly,
      latestStatus,
      siteName: site?.name,
    };
  });
}

   
   async createAnomaly(createAnomalyDto: CreateAnomalyDto, operator: User) {
  const { description, fileIds, assetId } = createAnomalyDto;

  const pendingStatus = await this.statusRepository.findOne({
    where: { name: 'pending', type: 'anomaly' },
  });

  if (!pendingStatus) {
    throw new NotFoundException("Default 'pending' status not found for anomaly");
  }

  const asset = await this.assetRepository.findOne({ where: { id: assetId } });
  if (!asset) {
    throw new NotFoundException('Asset with the given ID not found');
  }

  let files: File[] = [];
  if (fileIds && fileIds.length > 0) {
    files = await this.fileRepository.findByIds(fileIds);
    if (files.length !== fileIds.length) {
      throw new NotFoundException('One or more fileIds are invalid');
    }
  }

  const anomaly = this.anomalyRepository.create({
    description,
    asset,
    operator,
  });

  const savedAnomaly = await this.anomalyRepository.save(anomaly);

  for (const file of files) {
    file.anomaly = savedAnomaly;
    await this.fileRepository.save(file);
  }

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
    relations: [
      'files',
      'statusHistory',
      'statusHistory.status',
      'operator',
      'asset',
      'asset.location',
      'asset.location.service',
      'asset.location.service.department',
      'asset.location.service.department.site',
    ],
  });

  if (!anomaly) {
    throw new NotFoundException(`Anomaly with ID ${id} not found`);
  }

  // S'assurer que statusHistory est trié par createdAt DESC
  const sortedStatusHistory = Array.isArray(anomaly.statusHistory)
    ? [...anomaly.statusHistory].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  const latestStatus = sortedStatusHistory[0]?.status ?? null;
  const site = (anomaly.asset as Asset)
  ?.location?.['service']?.['department']?.['site'];

  return {
    ...anomaly,
    latestStatus,
    statusHistory: sortedStatusHistory,
    site: site,
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
