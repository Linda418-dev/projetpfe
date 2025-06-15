import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { AssetStatusEnum } from 'src/status/types/enums/asset-status.enum';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { userRepository } from 'src/user/repositories/user.repository';


@Injectable()
export class AnomalyService {
    constructor (
        private readonly anomalyRepository : AnomalyRepository,
        private readonly fileRepository : FileRepository,
        private readonly statusRepository : StatusRepository,
        private readonly anomalyStatusRepository : AnomalyStatusRepository,
        private readonly assetRepository: AssetRepository,
        private readonly assetStatusHistoryRepository : AssetStatusRepository,
        private readonly userRepository : userRepository,
        private readonly assetStatusRepository : AssetStatusRepository
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
  'reportedBy',
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
  } else if (userRole === 'operator'|| userRole === 'employee') {
    anomalies = await this.anomalyRepository.find({
      where: { reportedBy: { id: currentUser.id } },
      relations: [
        'files',
        'statusHistory',
        'statusHistory.status',
        'reportedBy',
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
  ? [...anomaly.statusHistory]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.status ?? null
  : null;

    const site = anomaly.asset?.location?.['service']?.['department']?.['site'];
    return {
      ...anomaly,
      latestStatus,
      siteName: site?.name,
    };
  });
}  

  // creation anomalie
  async createAnomaly(createAnomalyDto: CreateAnomalyDto, reportedBy: User) {
  const { description, fileIds, assetId } = createAnomalyDto;

  // récupérer le statut "pending" de type "anomaly"
  const pendingStatus = await this.statusRepository.findOne({
    where: { name: 'pending', type: 'anomaly' },
  });

  if (!pendingStatus) {
    throw new NotFoundException("Default 'pending' status not found for anomaly");
  }

  // récupérer l'asset 
  const asset = await this.assetRepository.findOne({ where: { id: assetId } });
  if (!asset) {
    throw new NotFoundException('Asset with the given ID not found');
  }

  // récupérer les fichiers 
  let files: File[] = [];
  if (fileIds && fileIds.length > 0) {
    files = await this.fileRepository.findByIds(fileIds);
    if (files.length !== fileIds.length) {
      throw new NotFoundException('One or more fileIds are invalid');
    }
  }

  // create
  const anomaly = this.anomalyRepository.create({
    description,
    asset,
    reportedBy,
  });

  // save
  const savedAnomaly = await this.anomalyRepository.save(anomaly);
  // associer les fichiers
  if (files.length > 0) {
    for (const file of files) {
      file.anomaly = savedAnomaly;
    }
    await this.fileRepository.save(files);
  }
  const anomalyStatus = this.anomalyStatusRepository.create({
    anomaly: savedAnomaly,
    status: pendingStatus,
  });

  await this.anomalyStatusRepository.save(anomalyStatus);
  const fullAnomaly = await this.anomalyRepository.findOne({
    where: { id: savedAnomaly.id },
    relations: [
      'asset',
      'reportedBy',
      'files',
      'statusHistory',
      'statusHistory.status',
      'assignedTo',
    ],
  });

  return fullAnomaly;
}

async getAnomaliesByMonth() {
  const result = await this.anomalyRepository.getAnomaliesByMonthRaw();
  return result.map(item => ({
    month: item.month,
    count: parseInt(item.count, 10),
  }));
}
  async getAnomalyById(id: string) {
  const anomaly = await this.anomalyRepository.findOne({
    where: { id },
    relations: [
      'files',
      'statusHistory',
      'statusHistory.status',
      'reportedBy',
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

  //  trié par createdAt DESC
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
  // Vérifier si l'anomalie existe
  const anomaly = await this.anomalyRepository.findOne({ where: { id: anomalyId } });
  if (!anomaly) {
    throw new NotFoundException('Anomaly not found');
  }

  // Chercher le statut 'in_progress'
  const inProgressStatus = await this.statusRepository.findOne({
    where: { name: 'in_progress', type: 'anomaly' },
  });

  if (!inProgressStatus) {
    throw new NotFoundException("Status 'in_progress' not found for anomaly");
  }

  // Vérifier si ce statut a déjà été appliqué à cette anomalie
  const existing = await this.anomalyStatusRepository.findOne({
    where: {
      anomaly: { id: anomalyId },
      status: { id: inProgressStatus.id },
    },
    relations: ['status'],
  });

  if (existing) {
    throw new BadRequestException("This anomaly has already been marked as 'in_progress'");
  }

  // Récupérer le dernier statut de l’anomalie
  const lastStatus = await this.anomalyStatusRepository.findOne({
    where: { anomaly: { id: anomalyId } },
    order: { createdAt: 'DESC' },
    relations: ['status'],
  });

  if (!lastStatus) {
    throw new NotFoundException("No previous status found for this anomaly");
  }

  if (typeof lastStatus.status !== 'object' || lastStatus.status.name !== 'pending') {
  throw new BadRequestException("Anomaly must be in 'pending' status to progress to 'in_progress'");
}


  // Créer et sauvegarder le nouveau statut
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

  
async resolveAnomaly(anomalyId: string) {
  const anomaly = await this.anomalyRepository.findOne({
    where: { id: anomalyId },
    relations: ['asset'],
  });

  if (!anomaly) {
    throw new NotFoundException('Anomaly not found');
  }

  // Récupérer le dernier statut de l’anomalie
  const lastStatus = await this.anomalyStatusRepository.findOne({
    where: { anomaly: { id: anomalyId } },
    order: { createdAt: 'DESC' },
    relations: ['status'],
  });

  if (!lastStatus) {
    throw new NotFoundException("No previous status found for this anomaly");
  }

 if (
  typeof lastStatus.status !== 'string' &&
  (lastStatus.status.name === 'resolved' || lastStatus.status.name === 'refused')
) {
  throw new BadRequestException("This anomaly is already resolved or has been refused");
}

  // Statuts nécessaires
  const [resolvedStatus, inProgressStatus] = await Promise.all([
    this.statusRepository.findOne({ where: { name: 'resolved', type: 'anomaly' } }),
    this.statusRepository.findOne({ where: { name: 'in_progress', type: 'anomaly' } }),
  ]);

  if (!resolvedStatus || !inProgressStatus) {
    throw new NotFoundException("Required anomaly statuses not found (resolved/in_progress)");
  }

  if (
  typeof lastStatus.status !== 'string' &&
  lastStatus.status.name === 'pending'
) {
  const inProgress = this.anomalyStatusRepository.create({
    anomaly,
    status: inProgressStatus,
  });
  await this.anomalyStatusRepository.save(inProgress);
}

  // Enregistrer le statut 'resolved'
  const resolved = this.anomalyStatusRepository.create({
    anomaly,
    status: resolvedStatus,
  });
  await this.anomalyStatusRepository.save(resolved);

  // Mettre à jour l’état de l’asset à 'IN_REPAIR'
  const inRepairStatus = await this.statusRepository.findOne({
    where: { name: AssetStatusEnum.IN_REPAIR, type: 'asset' },
  });

  if (!inRepairStatus) {
    throw new NotFoundException("Status 'In Repair' not found for asset");
  }

  const assetStatusRecord = this.assetStatusHistoryRepository.create({
    asset: anomaly.asset,
    status: inRepairStatus,
  });

  await this.assetStatusHistoryRepository.save(assetStatusRecord);

  return {
    message: 'Anomaly marked as resolved and asset marked as In Repair',
    anomaly,
    status: resolvedStatus,
  };
}


 async refuseAnomaly(anomalyId: string) {
  // Vérifier si l'anomalie existe
  const anomaly = await this.anomalyRepository.findOne({
    where: { id: anomalyId },
    relations: ['asset'],
  });

  if (!anomaly) {
    throw new NotFoundException('Anomaly not found');
  }

  // Récupérer le dernier statut de l’anomalie
  const lastStatus = await this.anomalyStatusRepository.findOne({
    where: { anomaly: { id: anomalyId } },
    order: { createdAt: 'DESC' },
    relations: ['status'],
  });

  if (!lastStatus) {
    throw new NotFoundException("No previous status found for this anomaly");
  }

  const lastStatusName = typeof lastStatus.status === 'string'
    ? lastStatus.status
    : lastStatus.status.name;

  // Empêcher le refus si le dernier statut est 'refused' ou 'resolved'
  if (lastStatusName === 'refused' || lastStatusName === 'resolved') {
    throw new BadRequestException(`This anomaly is already ${lastStatusName}`);
  }

  // Récupérer les statuts nécessaires
  const [refusedStatus, inProgressStatus , damagedAssetStatus] = await Promise.all([
    this.statusRepository.findOne({ where: { name: 'refused', type: 'anomaly' } }),
    this.statusRepository.findOne({ where: { name: 'in_progress', type: 'anomaly' } }),
    this.statusRepository.findOne({ where: { name: 'Damaged', type: 'asset' } }),

  ]);

  if (!refusedStatus || !inProgressStatus  || !damagedAssetStatus) {
    throw new NotFoundException("Required statuses 'refused' or 'in_progress' not found");
  }

  // Si le dernier statut est 'pending', enregistrer d'abord 'in_progress'
  if (lastStatusName === 'pending') {
    const inProgress = this.anomalyStatusRepository.create({
      anomaly,
      status: inProgressStatus,
    });
    await this.anomalyStatusRepository.save(inProgress);
  }

  // Ajouter le statut 'refused'
  const refused = this.anomalyStatusRepository.create({
    anomaly,
    status: refusedStatus,
  });

  await this.anomalyStatusRepository.save(refused);
  
  // Enregistrer le nouveau statut de l'asset dans AssetStatus
  const assetStatus = this.assetStatusRepository.create({
    asset: anomaly.asset,
    status: damagedAssetStatus,
  });
  await this.assetStatusRepository.save(assetStatus);

  //  Mettre à jour le statut actuel du bien
  await this.assetRepository.update(anomaly.asset['id'] || anomaly.asset, {
    status: damagedAssetStatus,
  });


  const updatedAsset = await this.assetRepository.findOne({
  where: { id: typeof anomaly.asset === 'string' ? anomaly.asset : anomaly.asset.id },
  relations: ['status'],
});

  return {
    message: 'Anomaly status updated to refused',
    anomaly,
    status: updatedAsset?.status,
  };
}

  async getAnomaliesBySite(siteId: string) {
    return this.anomalyRepository.findBySiteId(siteId);
  }

 // assigner anomalie au technicien
  async assignTechnicianToAnomaly(anomalyId: string, technicianId: string) {
  const anomaly = await this.anomalyRepository.findOne({
    where: { id: anomalyId },
    relations: ['statusHistory', 'statusHistory.status', 'asset'],
  });

  if (!anomaly) {
    throw new NotFoundException('Anomaly not found');
  }

  const technician = await this.userRepository.findOne({ where: { id: technicianId } });
  if (!technician) {
    throw new NotFoundException('Technician not found');
  }

  const asset = anomaly.asset as Asset;

  // Récupérer le statut "IN_REPAIR"
  const inRepairStatus = await this.statusRepository.findOne({
    where: { name: 'In Repair', type: 'asset' },
  });

  if (!inRepairStatus) {
    throw new NotFoundException('Status "In Repair" not found');
  }

  // Modifier le statut du bien
  asset.status = inRepairStatus;
  await this.assetRepository.save(asset);

  // Enregistrer dans l’historique de statut
  const assetStatus = this.assetStatusRepository.create({
    asset,
    status: inRepairStatus,
  });
  await this.assetStatusRepository.save(assetStatus);

  // Affecter le technicien
  anomaly.assignedTo = technician;
  await this.anomalyRepository.save(anomaly);

  return {
    message: 'Technician successfully assigned to anomaly. Asset marked as In Repair.',
    anomaly,
    assignedTo: technician,
  };
}

async getAllAnomaliesForTechnician(currentUser: User) {
  let anomalies;

  const userRole = typeof currentUser.role === 'string'
    ? currentUser.role
    : currentUser.role?.role;

  const commonRelations = [
    'files',
    'statusHistory',
    'statusHistory.status',
    'reportedBy',
    'asset',
    'asset.location',
    'asset.location.service',
    'asset.location.service.department',
    'asset.location.service.department.site',
  ];

  if (userRole === 'admin') {
    anomalies = await this.anomalyRepository.find({
      relations: commonRelations,
      order: { createdAt: 'DESC' },
    });
  } else if (userRole === 'operator' || userRole === 'employee') {
    anomalies = await this.anomalyRepository.find({
      where: { reportedBy: { id: currentUser.id } },
      relations: commonRelations,
      order: { createdAt: 'DESC' },
    });
  } else if (userRole === 'technician') {
    anomalies = await this.anomalyRepository.find({
      where: { assignedTo: { id: currentUser.id } },
      relations: commonRelations,
      order: { createdAt: 'DESC' },
    });
  } else {
    throw new UnauthorizedException('Rôle non autorisé');
  }

  return anomalies.map(anomaly => {
    const latestStatus = Array.isArray(anomaly.statusHistory)
      ? [...anomaly.statusHistory].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]?.status ?? null
      : null;

    const site = anomaly.asset?.location?.['service']?.['department']?.['site'];

    return {
      ...anomaly,
      latestStatus,
      siteName: site?.name,
    };
  });
}

  
}
