import { Module } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { AnomalyController } from './anomaly.controller';
import { AnomalyRepository } from './Repositories/anomaly.repository';

@Module({
  providers: [AnomalyService,AnomalyRepository],
  controllers: [AnomalyController]
})
export class AnomalyModule {}
