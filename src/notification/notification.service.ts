import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NotificationRepository } from './repositories/inventory.repository';
import { In } from 'typeorm';
import { userRepository } from 'src/user/repositories/user.repository';


@Injectable()
export class NotificationService {
    private readonly ONE_SIGNAL_APP_ID: string;
    private readonly ONE_SIGNAL_API_KEY: string;
  
    constructor(private configService: ConfigService , 
        private readonly notificationRepo : NotificationRepository,
        private readonly userRepository: userRepository,
    ) {
        this.ONE_SIGNAL_APP_ID = this.configService.get<string>('ONESIGNAL_APP_ID')!;
        this.ONE_SIGNAL_API_KEY = this.configService.get<string>('ONESIGNAL_API_KEY')!;
      }
      async getAllNotifications(user: any) {
        if (user.role?.role === 'operator') {
          // L'utilisateur est un opérateur : on filtre les notifications qui le concernent
          return this.notificationRepo
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.recipients', 'recipient')
            .where('recipient.id = :userId', { userId: user.id })
            .orderBy('notification.createdAt', 'DESC')
            .getMany();
        }
      
        // Si ce n'est pas un opérateur, on renvoie toutes les notifications
        return this.notificationRepo.find({
          relations: ['recipients'],
          order: { createdAt: 'DESC' },
        });
      }
    //   methode pour notifier les operateurs  
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
           // 2. Récupérer les utilisateurs correspondant aux playerIds
      const users = await this.userRepository.find({ where: { playerId: In(playerIds) } });

      // 3. Créer et enregistrer la notification avec les destinataires
      const notification = this.notificationRepo.create({
        playerIds,
        title,
        message,
        recipients: users,
      });

      await this.notificationRepo.save(notification);
    } catch (error) {
      console.error('Notification failed:', error.response?.data || error.message);
    }
  }

// methode pour get  notification by id 
  async getNotificationById(id: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id },
      relations: ['recipients'],
    });
  
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
  
    return notification;
  }
    
}
