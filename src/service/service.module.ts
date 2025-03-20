import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceRepository } from './repositories/service.repository';
import { DepartmentRepository } from 'src/department/repositories/department.repository';

@Module({
  providers: [ServiceService,ServiceRepository, DepartmentRepository],
  controllers: [ServiceController]
})
export class ServiceModule {}
