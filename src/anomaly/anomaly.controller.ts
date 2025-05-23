import { Body, Controller, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAnomalyDto } from './types/dto/create-anomaly.dto';
import { BypassInventoryLock } from 'src/inventory/guards/bypass-inventory-lock.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AssignTechnicianDto } from './types/dto/assign-technician.dto';

@ApiBearerAuth()
@ApiTags('Anomaly Resource')
@Controller('anomalies')
export class AnomalyController {
    constructor(private readonly anomalyService: AnomalyService) {}
    @Get()
    @UseGuards(JwtAuthGuard)
    getAllAnomalies(@Request() req) {
      return this.anomalyService.getAllAnomalies(req.user);
    }


    @Post()
    @UseGuards(JwtAuthGuard)
    createAnomaly(@Body() createAnomalyDto: CreateAnomalyDto, @Request() req) {
      return this.anomalyService.createAnomaly(createAnomalyDto, req.user);
    }

    @Get('statistics/by-month')
    getAnomaliesByMonth() {
      return this.anomalyService.getAnomaliesByMonth();
    }

    @BypassInventoryLock()
    @Get(':id')
    getAnomalyById(@Param('id') id: string) {
      return this.anomalyService.getAnomalyById(id);
    }

    @Patch(':id/progress')
    progressAnomaly(@Param('id') id: string) {
      return this.anomalyService.progressAnomaly(id);
    }

    @Post(':id/assign-technician')
    async assignTechnician(
      @Param('id') id: string,
      @Body() assignDto: AssignTechnicianDto,
    ) {
      return this.anomalyService.assignTechnician(id, assignDto.technicianId);
    }

     
 
    @Patch(':id/accept')
    acceptAnomaly(@Param('id') id: string){
      return this.anomalyService.acceptAnomaly(id);
    }
    
    @Patch(':id/refuse')
    refuseAnomaly(@Param('id') id: string){
      return this.anomalyService.refuseAnomaly(id);
    }
}
