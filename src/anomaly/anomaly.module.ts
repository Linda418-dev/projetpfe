import { Module } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { AnomalyController } from './anomaly.controller';
import { AnomalyRepository } from './Repositories/anomaly.repository';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { InventoryDetailsRepository } from 'src/inventory-details/repositories/inventory-details.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { AnomalyStatusRepository } from 'src/anomaly-status/repositories/anomaly-status.repository';

@Module({
  providers: [AnomalyService,AnomalyRepository,FileRepository,InventoryDetailsRepository,StatusRepository,AnomalyStatusRepository],
  controllers: [AnomalyController]
})
export class AnomalyModule {}
