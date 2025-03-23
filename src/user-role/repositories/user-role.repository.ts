import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserRoleEntity } from '../entities/user-role.entity';



@Injectable()
export class userRoleRepository extends Repository<UserRoleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserRoleEntity, dataSource.createEntityManager());
  }
}
