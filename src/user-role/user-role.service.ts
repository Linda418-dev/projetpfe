import { BadRequestException, Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { userRoleRepository } from './repositories/user-role.repository';
import { UserRoleEnum } from './types/enums/user-role.enum';

@Injectable()
export class UserRoleService  {
    constructor(
      private readonly userRoleRepository: userRoleRepository,
    ) {}
  
   
    async getAllRoles() {
      return this.userRoleRepository.find();
    }

    
  async createRole(role: UserRoleEnum){
    const exists = await this.userRoleRepository.findOneBy({ role });
    if (exists) {
      throw new BadRequestException(`Role "${role}" already exists`);
    }
    const newRole = this.userRoleRepository.create({ role });
    return this.userRoleRepository.save(newRole);
  }
  
    async getRoleById(id: string) {
      const role = await this.userRoleRepository.findOne({ where: { id } });
      if (!role) {
        throw new NotFoundException(`UserRole with id ${id} not found`);
      }
      return role;
    }

}
