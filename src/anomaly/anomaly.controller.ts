import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAnomalyDto } from './types/dto/create-anomaly.dto';
import { BypassInventoryLock } from 'src/inventory/guards/bypass-inventory-lock.decorator';

@ApiTags('Anomaly Resource')
@Controller('anomalies')
export class AnomalyController {
    constructor(private readonly anomalyService: AnomalyService) {}
    @Get()
    getAllanomalies() {
      return this.anomalyService.getAllanomalies();
    }

    @BypassInventoryLock()
    @Post()
    createAnomaly(@Body() createAnomalyDto: CreateAnomalyDto) {
      return this.anomalyService.createAnomaly(createAnomalyDto);
    }

    @BypassInventoryLock()
    @Get(':id')
    getAnomalyById(@Param('id') id: string) {
      return this.anomalyService.getAnomalyById(id);
    }

    @BypassInventoryLock()
    @Patch(':id/progress')
    progressAnomaly(@Param('id') id: string){
      return this.anomalyService.progressAnomaly(id);
    }

    @BypassInventoryLock()
    @Patch(':id/accept')
    acceptAnomaly(@Param('id') id: string){
      return this.anomalyService.acceptAnomaly(id);
    }

    @BypassInventoryLock()
    @Patch(':id/refuse')
    refuseAnomaly(@Param('id') id: string){
      return this.anomalyService.refuseAnomaly(id);
    }
}
