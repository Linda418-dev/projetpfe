import { Controller, Get, Param } from '@nestjs/common';
import { StatusService } from './status.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Status Resource')
@Controller('statuses')
export class StatusController {
    constructor(private readonly statusService: StatusService) {}

    @Get()
    getAllStatuses() {
      return this.statusService.getAllStatuses();
    }
  
    @Get(':id')
    getStatusById(@Param('id') id: string) {
      return this.statusService.getStatusById(id);
    }
}
