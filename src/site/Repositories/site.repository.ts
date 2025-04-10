import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {  Site } from '../Entities/site.entity';


@Injectable()
export class SiteRepository extends Repository<Site> {
  constructor(private readonly dataSource: DataSource) {
    super(Site, dataSource.createEntityManager());
  }

async findSiteWithRelationsById(id: string) {
  return this.createQueryBuilder('site')
    .leftJoinAndSelect('site.departments', 'department')
    .leftJoinAndSelect('department.services', 'service')
    .leftJoinAndSelect('service.locations', 'location')
    .where('site.id = :id', { id })
    .getOne();
}

}
