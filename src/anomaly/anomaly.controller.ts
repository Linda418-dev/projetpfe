import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAnomalyDto } from './types/dto/create-anomaly.dto';
import { BypassInventoryLock } from 'src/inventory/guards/bypass-inventory-lock.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AssignTechnicianDto } from './types/dto/assign-technician.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User } from 'src/user/entities/user.entity';

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

      @Get('site/:siteId')
      async getAnomaliesBySite(@Param('siteId') siteId: string) {
    return this.anomalyService.getAnomaliesBySite(siteId);
  }


    @Post()
    @UseGuards(JwtAuthGuard)
    createAnomaly(@Body() createAnomalyDto: CreateAnomalyDto, @Request() req) {
      return this.anomalyService.createAnomaly(createAnomalyDto, req.user);
    }


      @Get('anomaly')
       @UseGuards(JwtAuthGuard, RolesGuard)
      async getAllAnomaliesforTechnicien(@Request() req) {
        const user: User = req.user;
        return this.anomalyService.getAllAnomaliesForTechnician(user);
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

    @Patch(':id/resolve')
    resolveAnomaly(@Param('id') id: string){
      return this.anomalyService.resolveAnomaly(id);
    }
    
    @Patch(':id/refuse')
    refuseAnomaly(@Param('id') id: string){
      return this.anomalyService.refuseAnomaly(id);
    }

    @Patch(':id/assign-technician')
    async assignTechnician(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() assignTechnicianDto: AssignTechnicianDto,) {
        return this.anomalyService.assignTechnicianToAnomaly(id, assignTechnicianDto.technicianId);
      }

     
   

}
