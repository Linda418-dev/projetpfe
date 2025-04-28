import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAnomalyDto } from './types/dto/create-anomaly.dto';

@ApiTags('Anomaly Resource')
@Controller('anomalies')
export class AnomalyController {
    constructor(private readonly anomalyService: AnomalyService) {}

    @Get()
    getAllanomalies() {
      return this.anomalyService.getAllanomalies();
    }

    @Post()
    createAnomaly(@Body() createAnomalyDto: CreateAnomalyDto) {
      return this.anomalyService.createAnomaly(createAnomalyDto);
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
