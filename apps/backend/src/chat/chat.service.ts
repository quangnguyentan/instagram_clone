// chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async findByUser(userId: string) {
    return this.chatModel.find({ members: userId }).populate('lastMessage');
  }

  async create(members: string[]) {
    return this.chatModel.create({ members });
  }
}
