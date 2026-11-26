// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './entities/notification.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notifModel: Model<Notification>,
  ) { }

  async create(dto: CreateNotificationDto) {
    const created = await this.notifModel.create(dto);
    return created.populate('fromUser', 'username _id avatarUrl');
  }

  findByUser(userId: string) {
    return this.notifModel
      .find({ user: userId })
      .populate('fromUser', 'username _id avatarUrl')
      .populate('post', '_id')
      .sort({ createdAt: -1 });
  }

  async markRead(id: string, userId: string) {
    const updated = await this.notifModel
      .findOneAndUpdate({ _id: id, user: userId }, { isRead: true }, { new: true })
      .populate('fromUser', 'username _id avatarUrl')
      .populate('post', '_id')
      .exec();
    if (!updated) throw new NotFoundException('Không tìm thấy thông báo');
    return updated;
  }

  async markAllRead(userId: string) {
    const result = await this.notifModel.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } },
    );
    return { modifiedCount: result.modifiedCount };
  }
}