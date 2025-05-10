import { Controller, Get, Param } from '@nestjs/common';
import { AnomalyStatusService } from './anomaly-status.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Anomaly status Resource')
@Controller('anomaly-statuses')
export class AnomalyStatusController {
    constructor(private readonly anomalyStatusService: AnomalyStatusService) {}

    @Get()
    getAllHistory() {
      return this.anomalyStatusService.getAllHistory();
    }
  
    @Get(':anomalyId')
    getHistoryByAnomalyId(@Param('anomalyId') anomalyId: string) {
      return this.anomalyStatusService.getHistoryByAnomalyId(anomalyId);
    }
}
