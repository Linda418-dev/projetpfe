import { Module } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { AnomalyController } from './anomaly.controller';
import { AnomalyRepository } from './Repositories/anomaly.repository';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { InventoryDetailsRepository } from 'src/inventory-details/repositories/inventory-details.repository';

@Module({
  providers: [AnomalyService,AnomalyRepository,FileRepository,InventoryDetailsRepository],
  controllers: [AnomalyController]
})
export class AnomalyModule {}
