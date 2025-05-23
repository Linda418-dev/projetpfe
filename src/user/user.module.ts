import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userRepository } from './repositories/user.repository';
import { BcryptService } from 'src/auth/common/bcrypt.service';
import { userRoleRepository } from 'src/user-role/repositories/user-role.repository';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { NotificationRepository } from 'src/notification/repositories/notification.repository';

@Module({
  providers: [UserService,userRepository,BcryptService,userRoleRepository,NotificationService,ConfigService,NotificationRepository],
  controllers: [UserController]
})
export class UserModule {}
