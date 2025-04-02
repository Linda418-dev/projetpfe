import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userRepository } from './repositories/user.repository';

@Module({
  providers: [UserService , userRepository],
  controllers: [UserController]
})
export class UserModule {}
