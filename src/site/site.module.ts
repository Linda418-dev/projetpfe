import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { SiteRepository } from './Repositories/site.repository';
import { DepartmentRepository } from 'src/department/repositories/department.repository';
import { ServiceRepository } from 'src/service/repositories/service.repository';
import { LocationRepository } from 'src/location/repositories/location.repository';

@Module({
  providers: [SiteService,SiteRepository,DepartmentRepository,ServiceRepository,LocationRepository],
  controllers: [SiteController]
})
export class SiteModule {}
