import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger';
import { SendNotificationDto } from './type/dto/createnotif.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllNotifications(@Req() req){
    const user = req.user;
    return this.notificationService.getAllNotifications(user);
  }
  
  @Post('send')
  async sendNotification(@Body() dto: SendNotificationDto){
    await this.notificationService.notifyOperators(dto.playerIds, dto.title, dto.message);
    return { message: 'Notification envoyée' };
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('notifications/unread-count')
  getTotalUnread() {
  return this.notificationService.countAllUnread();
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationService.getNotificationById(id);
  }
  @Patch(':id/read')
  markRead(@Param('id') id: string) {
  return this.notificationService.markAsRead(id);
  }
  @Post('reset-password/:id')
  async resetPassword(@Param('id') id: string) {
  return this.notificationService.resetUserPasswordAndNotify(id);
  }


  
  
}