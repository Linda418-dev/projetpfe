import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendNotificationDto } from './type/dto/createnotif.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllNotifications(@Req() req) {
    const user = req.user;
    return this.notificationService.getAllNotifications(user);
  }
  
  @Post('send')
  async sendNotification(@Body() dto: SendNotificationDto){
    await this.notificationService.notifyOperators(dto.playerIds, dto.title, dto.message);
    return { message: 'Notification envoyée' };
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationService.getNotificationById(id);
  }
 
  
}