import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { StatusRepository } from './repositories/status.repository';

@Module({
  providers: [StatusService,StatusRepository],
  controllers: [StatusController]
})
export class StatusModule {}
