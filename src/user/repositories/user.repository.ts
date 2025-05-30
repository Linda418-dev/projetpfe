import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { PaginateSearchDto } from '../types/dto/paginate-search.dto';


@Injectable()
export class userRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findAllOperators() {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('role.role = :role', { role: 'operator' })
      .getMany();
  }


  async getAllUsersWithPaginate(params: PaginateSearchDto) {
   const query = this.createQueryBuilder("user")
    .leftJoinAndSelect("user.role", "role")

  if (params.keyword) {
    query.andWhere(
      "(user.username ILIKE :keyword OR user.email ILIKE :keyword)",
      { keyword: `%${params.keyword}%` }
    );
  }
  
  if (params.isActive) {
    query.andWhere("user.isActive = :isActive", { isActive: params.isActive });
  }

  if (params.orderField && params.orderDirection) {
    query.orderBy(`user.${params.orderField}`, params.orderDirection.toUpperCase() as 'ASC' | 'DESC');
  } else {
    query.orderBy("user.createdAt", "DESC");
  }

  if (params.skip) {
    query.skip(params.skip);
  }

  if (params.take) {
    query.take(params.take);
  }

  return query.getManyAndCount();
}


}
