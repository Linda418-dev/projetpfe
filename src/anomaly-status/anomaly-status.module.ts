import { Module } from '@nestjs/common';
import { AnomalyStatusController } from './anomaly-status.controller';
import { AnomalyStatusService } from './anomaly-status.service';
import { AnomalyStatusRepository } from './repositories/anomaly-status.repository';

@Module({
  controllers: [AnomalyStatusController],
  providers: [AnomalyStatusService,AnomalyStatusRepository]
})
export class AnomalyStatusModule {}
