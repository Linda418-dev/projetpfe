import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentRepository } from './repositories/department.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';
import { ServiceRepository } from 'src/service/repositories/service.repository';
import { LocationRepository } from 'src/location/repositories/location.repository';

@Module({
  providers: [DepartmentService , DepartmentRepository, SiteRepository,ServiceRepository,LocationRepository,],
  controllers: [DepartmentController]
})
export class DepartmentModule {}
