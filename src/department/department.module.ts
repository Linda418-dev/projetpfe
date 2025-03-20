import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentRepository } from './repositories/department.repository';

@Module({
  providers: [DepartmentService , DepartmentRepository],
  controllers: [DepartmentController]
})
export class DepartmentModule {}
