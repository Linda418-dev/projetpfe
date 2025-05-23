import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NotificationRepository } from './repositories/notification.repository';
import { In } from 'typeorm';
import { userRepository } from 'src/user/repositories/user.repository';
import { translate } from '@vitalets/google-translate-api';
import * as bcrypt from 'bcrypt';

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
          // renvoi tous les notification d'un operateur 
          return this.notificationRepo.findAllByUserId(user.id);
        }
        // Si ce n'est pas un opérateur, on renvoie toutes les notifications
        const notifications=await  this.notificationRepo.find({
          relations: ['recipients'],
          order: { createdAt: 'DESC' },
        });

         // marquer toutes les notifications comme seen 
        const unseenNotifications = notifications.filter(notif => !notif.seen);
        for (const notif of unseenNotifications) {
          notif.seen = true;
        }
        if (unseenNotifications.length > 0) {
          await this.notificationRepo.save(unseenNotifications);
        }
        return notifications;
      }

    // Fonction intégrée de traduction vers le français
    private async translateToFrench(text: string) {
    try {
      const result = await translate(text, { to: 'fr' });
      return result.text;
    } catch (error) {
      console.error('Translation failed:', error.message);
      return text; 
    }
  }

    // methode pour notifier les operateurs  
    async notifyOperators(playerIds: string[], title: string, message: string) {
      try {

      // Traduire le message et le titre en français
      const translatedTitle = await this.translateToFrench(title);
      const translatedMessage = await this.translateToFrench(message);
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
    // récupérer les utilisateurs correspondant aux playerIds
      const users = await this.userRepository.find({ where: { playerId: In(playerIds) } });
      // créer  la notification avec les destinataires
      const notification = this.notificationRepo.create({
        playerIds,
        title: translatedTitle,
        message: translatedMessage,
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
  async markAsRead(id: string) {
  const notif = await this.notificationRepo.findOne({ where: { id } });
  if (!notif) throw new NotFoundException('Notification not found');
  notif.read = true;
  return this.notificationRepo.save(notif);
  }
  
  
   async countAllUnread() {
    return this.notificationRepo.countAllUnread();
  }


async resetUserPasswordAndNotify(userId: string) {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user || !user.playerId) {
    throw new NotFoundException('Utilisateur introuvable ou sans playerId');
  }

  const tempPassword = this.generateTempPassword();
  user.password = await bcrypt.hash(tempPassword, 10);
  await this.userRepository.save(user);

  const message = `Votre mot de passe temporaire est : ${tempPassword}. Veuillez le changer dès que possible.`;
  const title = 'Réinitialisation du mot de passe';

  await this.notifyOperators([user.playerId], title, message);
}

generateTempPassword(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}


}
