import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model, Types } from 'mongoose';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { Post } from 'src/post/entities/post.entity';
import { Reel } from 'src/reel/entities/reel.entity';
import { UserService } from 'src/user/user.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Reel.name) private readonly reelModel: Model<Reel>,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationGateway: NotificationGateway,
    private readonly userService: UserService,
  ) {}

  async create(dto: {
    post: string;
    user: string;
    content: string;
    parent?: string | null;
  }): Promise<Comment> {
    const post = await this.postModel.findById(dto.post).select('user');
    if (!post) throw new NotFoundException('Không tìm thấy bài viết');

    const saved = await new this.commentModel(dto).save();
    await saved.populate('user', 'username _id avatarUrl');
    await saved.populate('parent', 'user');

    const postOwner = post.user.toString();
    if (postOwner !== dto.user) {
      await this.notificationGateway.push(postOwner, {
        user: postOwner,
        type: 'comment',
        fromUser: dto.user,
        post: dto.post,
      });
    }

    const mentions = dto.content.match(/@(\w+)/g)?.map((match) => match.slice(1)) ?? [];
    for (const username of new Set(mentions)) {
      const mentionedUser = await this.userService.findByUsername(username);
      const recipientId = mentionedUser?._id?.toString();
      if (recipientId && recipientId !== dto.user && recipientId !== postOwner) {
        await this.notificationGateway.push(recipientId, {
          user: recipientId,
          type: 'mention',
          fromUser: dto.user,
          post: dto.post,
        });
      }
    }

    if (dto.parent) {
      const parentComment = await this.commentModel
        .findById(dto.parent)
        .select('user');
      const recipientId = parentComment?.user?.toString();
      if (recipientId && recipientId !== dto.user && recipientId !== postOwner) {
        await this.notificationGateway.push(recipientId, {
          user: recipientId,
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
    return this.commentModel
      .find({ post: postId })
      .populate('user', 'username _id avatarUrl')
      .populate('parent', 'user')
      .sort({ createdAt: -1 })
      .exec();
  }

  async createReelComment(dto: {
    reel: string;
    user: string;
    content: string;
  }): Promise<Comment> {
    if (!dto.content?.trim()) {
      throw new BadRequestException('Bình luận không được để trống');
    }
    const reel = await this.reelModel.findById(dto.reel).select('user');
    if (!reel) throw new NotFoundException('Không tìm thấy Reel');

    const comment = await new this.commentModel({
      reel: dto.reel,
      user: dto.user,
      content: dto.content.trim(),
    }).save();
    await comment.populate('user', 'username _id avatarUrl');
    this.eventEmitter.emit('reel.comment.created', comment);
    return comment;
  }

  async findByReel(reelId: string): Promise<Comment[]> {
    if (!Types.ObjectId.isValid(reelId)) {
      throw new NotFoundException('Không tìm thấy Reel');
    }
    return this.commentModel
      .find({ reel: reelId })
      .populate('user', 'username _id avatarUrl')
      .sort({ createdAt: 1 })
      .exec();
  }

  async update(
    id: string,
    dto: { content: string },
    userId: string,
    isAdmin = false,
  ): Promise<Comment> {
    const existing = await this.commentModel.findById(id);
    if (!existing) throw new NotFoundException('Không tìm thấy bình luận');
    if (existing.user.toString() !== userId && !isAdmin) {
      throw new ForbiddenException('Không có quyền sửa bình luận này');
    }
    const updated = await this.commentModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .populate('user', 'username _id avatarUrl')
      .populate('parent', 'user')
      .exec();
    if (!updated) throw new NotFoundException('Không tìm thấy bình luận');
    this.eventEmitter.emit('comment.updated', updated);
    return updated;
  }

  async remove(
    id: string,
    userId: string,
    isAdmin = false,
  ): Promise<{ id: string; postId?: string; reelId?: string }> {
    const existing = await this.commentModel.findById(id);
    if (!existing) throw new NotFoundException('Không tìm thấy bình luận');
    if (existing.user.toString() !== userId && !isAdmin) {
      throw new ForbiddenException('Không có quyền xóa bình luận này');
    }
    const deleted = await this.commentModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Không tìm thấy bình luận');
    const payload = {
      id: (deleted._id as Types.ObjectId).toString(),
      postId: deleted.post?.toString(),
      reelId: deleted.reel?.toString(),
    };
    this.eventEmitter.emit('comment.deleted', payload);
    return payload;
  }
}
