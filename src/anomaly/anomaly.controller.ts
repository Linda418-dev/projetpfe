import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAnomalyDto } from './types/dto/create-anomaly.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AssignTechnicianDto } from './types/dto/assign-technician.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiBearerAuth()
@ApiTags('Anomaly Resource')
@Controller('anomalies')
export class AnomalyController {
    constructor(private readonly anomalyService: AnomalyService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin','superAdmin','operator','employee')
    getAllAnomalies(@Request() req) {
      return this.anomalyService.getAllAnomalies(req.user);
    }

    @Get('site/:siteId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator','technician','employee')
    async getAnomaliesBySite(@Param('siteId') siteId: string) {
    return this.anomalyService.getAnomaliesBySite(siteId);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator','technician','employee')
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin')
    getAnomaliesByMonth() {
      return this.anomalyService.getAnomaliesByMonth();
    }

    
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator','technician','employee')
    getAnomalyById(@Param('id') id: string) {
      return this.anomalyService.getAnomalyById(id);
    }

    @Patch(':id/progress')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','technician')
    progressAnomaly(@Param('id') id: string) {
      return this.anomalyService.progressAnomaly(id);
    }

    @Patch(':id/resolve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','technician')
    resolveAnomaly(@Param('id') id: string){
      return this.anomalyService.resolveAnomaly(id);
    }
    
    @Patch(':id/refuse')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','technician')
    refuseAnomaly(@Param('id') id: string){
      return this.anomalyService.refuseAnomaly(id);
    }

    @Patch(':id/assign-technician')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin')
    async assignTechnician(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() assignTechnicianDto: AssignTechnicianDto,) {
        return this.anomalyService.assignTechnicianToAnomaly(id, assignTechnicianDto.technicianId);
      }

      
}
