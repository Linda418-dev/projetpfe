import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentRepository } from './repositories/department.repository';
import { PlaceRepository } from 'src/places/Repositories/Place.repository';

@Module({
  providers: [DepartmentService , DepartmentRepository , PlaceRepository],
  controllers: [DepartmentController]
})
export class DepartmentModule {}
