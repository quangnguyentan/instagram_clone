import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    private readonly userService: UserService,
  ) {}

  findByUser(userId: string) {
    return this.chatModel
      .find({ members: userId })
      .populate('members', 'username fullname avatarUrl')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username fullname avatarUrl' },
      })
      .sort({ updatedAt: -1 });
  }

  async createDirect(userId: string, recipientId: string) {
    if (!Types.ObjectId.isValid(recipientId) || userId === recipientId) {
      throw new BadRequestException('Người nhận không hợp lệ');
    }
    await this.userService.profile(recipientId);
    const members = [new Types.ObjectId(userId), new Types.ObjectId(recipientId)];
    const existing = await this.chatModel.findOne({
      members: { $all: members, $size: 2 },
    });
    const chat =
      existing ??
      (await this.chatModel.create({
        members,
      }));
    return chat.populate('members', 'username fullname avatarUrl');
  }

  async assertMember(chatId: string, userId: string) {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException('Mã hội thoại không hợp lệ');
    }
    const chat = await this.chatModel.findOne({
      _id: chatId,
      members: userId,
    });
    if (!chat) throw new NotFoundException('Không tìm thấy hội thoại');
    return chat;
  }
}
