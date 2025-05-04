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
  @ApiOperation({ summary: 'Envoyer une notification push via OneSignal' })
  @ApiResponse({ status: 201, description: 'Notification envoyée avec succès' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async sendNotification(@Body() dto: SendNotificationDto): Promise<{ message: string; }> {
    await this.notificationService.notifyOperators(dto.playerIds, dto.title, dto.message);
    return { message: 'Notification envoyée' };
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationService.getNotificationById(id);
  }
 
  
}