import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from 'src/chat/entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly msgModel: Model<Message>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async create(dto: CreateMessageDto, senderId: string) {
    if (!dto.content?.trim() && !dto.mediaUrl) {
      throw new BadRequestException('Tin nhắn không được để trống');
    }
    const chat = await this.chatModel.findOne({
      _id: dto.chatId,
      members: senderId,
    });
    if (!chat) throw new NotFoundException('Không tìm thấy hội thoại');

    const message = await this.msgModel.create({
      chatId: new Types.ObjectId(dto.chatId),
      sender: new Types.ObjectId(senderId),
      content: dto.content?.trim(),
      mediaUrl: dto.mediaUrl,
    });
    await this.chatModel.updateOne(
      { _id: chat._id },
      { $set: { lastMessage: message._id } },
    );
    return message.populate('sender', 'username fullname avatarUrl');
  }

  async findByChat(chatId: string, userId: string) {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException('Mã hội thoại không hợp lệ');
    }
    const isMember = await this.chatModel.exists({
      _id: chatId,
      members: userId,
    });
    if (!isMember) throw new NotFoundException('Không tìm thấy hội thoại');
    const messages = await this.msgModel.collection
      .find({
        chatId: {
          $in: [new Types.ObjectId(chatId), chatId],
        },
      })
      .sort({ createdAt: 1 })
      .toArray();
    return this.msgModel.populate(messages, {
      path: 'sender',
      select: 'username fullname avatarUrl',
    });
  }
}
