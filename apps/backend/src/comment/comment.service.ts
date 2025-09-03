import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './entities/comment.entity';
import { Model } from 'mongoose';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  findByPost(postId: string) {
    return this.commentModel.find({ post: postId }).sort({ createdAt: 1 });
  }
  create(dto: CreateCommentDto) {
    return this.commentModel.create(dto);
  }
  remove(id: string) {
    return this.commentModel.findByIdAndDelete(id);
  }
}
