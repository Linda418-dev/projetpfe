import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [NotificationService,ConfigService],
  controllers: [NotificationController]
})
export class NotificationModule {}
