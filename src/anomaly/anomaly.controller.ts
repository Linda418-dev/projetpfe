import { Controller, Get, Param, Patch } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Anomaly Resource')
@Controller('anomalies')
export class AnomalyController {
    constructor(private readonly anomalyService: AnomalyService) {}

    @Get()
    getAllanomalies() {
      return this.anomalyService.getAllanomalies();
    }
  
    @Get(':id')
    getAnomalyById(@Param('id') id: string) {
      return this.anomalyService.getAnomalyById(id);
    }

    @Patch(':id/accept')
    acceptAnomaly(@Param('id') id: string){
      return this.anomalyService.acceptAnomaly(id);
    }
 
}
