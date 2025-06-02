import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Service } from '../entities/service.entity';

@Injectable()
export class ServiceRepository extends Repository<Service> {
  constructor(private readonly dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

 async findAllByDepartments(departmentIds: string[]) {
  return this.createQueryBuilder('service')
    .leftJoinAndSelect('service.department', 'department')
    .leftJoinAndSelect('department.site', 'site')
    .where('department.id IN (:...departmentIds)', { departmentIds })
    .getMany();
}


}
