import { Body, Controller, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger';
import { SendNotificationDto } from './type/dto/createnotif.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

 
  
  @Post('send')
  async sendNotification(@Body() dto: SendNotificationDto){
    await this.notificationService.notifyOperators(dto.playerIds, dto.title, dto.message);
    return { message: 'Notification envoyée' };
  }


  @UseGuards(JwtAuthGuard)
  @Get('notifications/unread-count')
  getTotalUnread(@Request() req) {
    return this.notificationService.countAllUnread(req.user.id);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllNotifications(@Req() req){
    const user = req.user;
    return this.notificationService.getAllNotifications(user);
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationService.getNotificationById(id);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
  return this.notificationService.markAsRead(id);
  }

 

}