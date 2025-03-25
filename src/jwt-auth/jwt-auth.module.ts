import { Module } from '@nestjs/common';
import { JwtAuthController } from './jwt-auth.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [JwtAuthController],
  providers: [JwtService]
})
export class JwtAuthModule {}
