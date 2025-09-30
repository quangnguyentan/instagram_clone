// src/comment/comment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Comment } from './entities/comment.entity';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment')
    private readonly commentModel: Model<Comment>,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService, // Inject NotificationService
    private readonly userService: UserService // Inject UserService
  ) { }

  async create(dto: {
    post: string;
    user: string;
    content: string;
    parent?: string | null;
  }): Promise<Comment> {
    const created = new this.commentModel(dto);
    const saved = await created.save();
    await saved.populate('user', 'username _id avatar');
    await saved.populate('parent', 'user'); // Populate parent to get user info
    const mentions = dto.content.match(/@(\w+)/g)?.map((m) => m.slice(1)) || [];
    const mentionedUsers = await Promise.all(
      mentions.map(async (username) => {
        const user = await this.userService.findByUsername(username);
        return user?._id;
      })
    );

    // Create notifications for mentioned users
    for (const mentionedUserId of mentionedUsers.filter((id) => id)) {
      if (mentionedUserId?.toString() !== dto.user) { // Avoid notifying the commenter
        await this.notificationService.create({
          user: mentionedUserId as unknown as any,
          type: 'mention',
          fromUser: dto.user,
          post: dto.post,
        });
      }
    }

    // Create notification for parent comment's user (if replying)
    if (dto.parent) {
      const parentComment = await this.commentModel
        .findById(dto.parent)
        .populate('user')
        .exec();
      if (parentComment && parentComment.user._id.toString() !== dto.user) {
        await this.notificationService.create({
          user: parentComment?.user._id as unknown as any,
          type: 'comment',
          fromUser: dto.user,
          post: dto.post,
        });
      }
    }

    this.eventEmitter.emit('comment.created', saved);
    return saved;
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return await this.commentModel
      .find({ post: postId })
      .populate('user', 'username _id avatar') // lấy các field cần
      .populate('parent', 'user') // lấy các field cần
      .exec();
  }

  async update(id: string, dto: { content: string }): Promise<Comment> {
    const updated = await this.commentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('user', 'username _id avatar')
      .populate('parent', 'user')
      .exec();
    if (!updated) throw new NotFoundException('Comment not found');
    this.eventEmitter.emit('comment.updated', updated);
    return updated;
  }

  async remove(id: string): Promise<{ id: string; postId: string }> {
    const deleted = await this.commentModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Comment not found');
    const payload = {
      id: (deleted._id as Types.ObjectId).toString(),
      postId: (deleted.post as Types.ObjectId).toString(),
    };

    this.eventEmitter.emit('comment.deleted', payload);
    return payload;
  }
}
