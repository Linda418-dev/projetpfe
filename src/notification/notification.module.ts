import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ConfigService } from '@nestjs/config';
import { NotificationRepository } from './repositories/notification.repository';
import { userRepository } from 'src/user/repositories/user.repository';

@Module({
  providers: [NotificationService,ConfigService,NotificationRepository,userRepository],
  controllers: [NotificationController]
})
export class NotificationModule {}
