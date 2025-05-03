import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendNotificationDto } from './dto/createnotif.dto';

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @ApiOperation({ summary: 'Envoyer une notification push via OneSignal' })
  @ApiResponse({ status: 201, description: 'Notification envoyée avec succès' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async sendNotification(@Body() dto: SendNotificationDto): Promise<{ message: string; }> {
    await this.notificationService.notifyOperators(dto.playerIds, dto.title, dto.message);
    return { message: 'Notification envoyée' };
  }


  
}