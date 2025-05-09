import { Injectable, NotFoundException } from '@nestjs/common';
import { userRoleRepository } from './repositories/user-role.repository';

@Injectable()
export class UserRoleService  {
    constructor(
      private readonly userRoleRepository: userRoleRepository,
    ) {}
  
    async getAllRoles() {
      return this.userRoleRepository.find();
    }
  
    async getRoleById(id: string) {
      const role = await this.userRoleRepository.findOne({ where: { id } });
      if (!role) {
        throw new NotFoundException(`UserRole with id ${id} not found`);
      }
      return role;
    }

}
