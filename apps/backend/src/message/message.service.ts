// message.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly msgModel: Model<Message>,
  ) {}

  async create(dto: CreateMessageDto) {
    return this.msgModel.create(dto);
  }

  async findByChat(chatId: string) {
    return this.msgModel.find({ chatId }).sort({ createdAt: 1 });
  }
}
