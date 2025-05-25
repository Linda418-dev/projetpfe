import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Notification } from '../entities/notification.entity';


@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(private readonly dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }


  async findAllByUserId(userId: string) {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.recipients', 'recipient')
      .where('recipient.id = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
  }

  async countAllUnread(userId: string){
  return this.createQueryBuilder('notification')
    .innerJoin('notification.recipients', 'user')
    .where('user.id = :userId', { userId })
    .andWhere('notification.seen = false')
    .getCount();
}

 
}