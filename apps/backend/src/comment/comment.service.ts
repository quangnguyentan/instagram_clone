// src/comment/comment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment')
    private readonly commentModel: Model<Comment>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(dto: {
    post: string;
    user: string;
    content: string;
    parent?: string | null;
  }): Promise<Comment> {
    const created = new this.commentModel(dto);
    const saved = await created.save();
    this.eventEmitter.emit('comment.created', saved);
    return saved;
  }

  async findByPost(postId: string): Promise<Comment[]> {

    return await this.commentModel.find({ post: postId }).exec();
  }

  async update(id: string, dto: { content: string }): Promise<Comment> {
    const updated = await this.commentModel
      .findByIdAndUpdate(id, dto, { new: true })
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
