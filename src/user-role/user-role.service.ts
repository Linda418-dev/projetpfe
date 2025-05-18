import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { userRoleRepository } from './repositories/user-role.repository';
import { UserRoleEnum } from './types/enums/user-role.enum';

@Injectable()
export class UserRoleService  implements OnApplicationBootstrap{
    constructor(
      private readonly userRoleRepository: userRoleRepository,
    ) {}
  
    async onApplicationBootstrap() {
    for (const role of Object.values(UserRoleEnum)) {
      const exists = await this.userRoleRepository.findOneBy({ role });
      if (!exists) {
        await this.userRoleRepository.save({ role });
        console.log(` Role "${role}" inserted into database`);
      }
    }
  } 
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
