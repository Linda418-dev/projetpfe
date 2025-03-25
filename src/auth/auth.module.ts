import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { userRepository } from 'src/user/repositories/user.repository';
import { userRoleRepository } from 'src/user-role/repositories/user-role.repository';
import { ConfigModule } from '@nestjs/config';
import { UserRole } from 'src/user-role/entities/user-role.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User, UserRole]),
    PassportModule,
    ConfigModule.forRoot(), 
    JwtModule.register({
      secret: process.env.JWT_SECRET , 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, userRepository, userRoleRepository],
  exports: [AuthService],
})
export class AuthModule {}
