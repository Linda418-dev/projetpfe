import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NotificationService {
    private readonly ONE_SIGNAL_APP_ID: string;
    private readonly ONE_SIGNAL_API_KEY: string;
  
    constructor(private configService: ConfigService) {
        this.ONE_SIGNAL_APP_ID = this.configService.get<string>('ONESIGNAL_APP_ID')!;
        this.ONE_SIGNAL_API_KEY = this.configService.get<string>('ONESIGNAL_API_KEY')!;
      }
      
    async notifyOperators(playerIds: string[], title: string, message: string) {
      try {
        await axios.post(
          'https://onesignal.com/api/v1/notifications',
          {
            app_id: this.ONE_SIGNAL_APP_ID,
            include_player_ids: playerIds,
            headings: { en: title },
            contents: { en: message },
          },
          {
            headers: {
              Authorization: `Basic ${this.ONE_SIGNAL_API_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        );
      } catch (error) {
        console.error('Notification failed:', error.response?.data || error.message);
      }
    }
}
