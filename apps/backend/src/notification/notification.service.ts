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
  ) {}

  findByUser(userId: string) {
    return this.notifModel.find({ user: userId }).sort({ createdAt: -1 });
  }
  async create(dto: CreateNotificationDto) {
    return this.notifModel.create(dto);
  }
  markRead(id: string) {
    return this.notifModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
  }
}
