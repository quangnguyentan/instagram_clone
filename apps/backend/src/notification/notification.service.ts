// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notifModel: Model<Notification>,
  ) { }

  async create(dto: CreateNotificationDto) {
    const created = await this.notifModel.create(dto);
    return created.populate('fromUser', 'username _id avatar')
  }

  findByUser(userId: string) {
    return this.notifModel
      .find({ user: userId })
      .populate('fromUser', 'username _id avatar')
      .populate('post', '_id')
      .sort({ createdAt: -1 });
  }

  markRead(id: string) {
    return this.notifModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .populate('fromUser', 'username _id avatar')
      .populate('post', '_id')
      .exec();
  }
}