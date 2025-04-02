import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { userRoleRepository } from './repositories/user-role.repository';

@Module({
  providers: [UserRoleService , userRoleRepository],
  controllers: [UserRoleController]
})
export class UserRoleModule {}
