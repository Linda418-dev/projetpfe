import { Injectable, OnModuleInit } from '@nestjs/common';
import { userRoleRepository } from './repositories/user-role.repository';
import { UserRoleEnum } from './types/enums/user-role.enum';

@Injectable()
export class UserRoleService implements OnModuleInit {
    constructor(
      private readonly userRoleRepository: userRoleRepository,
    ) {}
  
    async onModuleInit() {
      await this.seedRoles();
    }
  
    private async seedRoles() {
      const count = await this.userRoleRepository.count();
      if (count === 0) {
        await this.userRoleRepository.save([
          { role: UserRoleEnum.ADMIN },
          { role: UserRoleEnum.OPERATOR },
        ]);
        console.log('User roles seeded successfully');
      }
    }

}
