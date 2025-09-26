import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ToggleLikeDto } from './dto/toggle-like.dto';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Reel } from 'src/reel/entities/reel.entity';
import { Story } from 'src/story/entities/story.entity';

@Injectable()
export class LikeService {
  private readonly modelMap: Record<string, Model<any>>;

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Reel.name) private readonly reelModel: Model<Reel>,
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
  ) {
    this.modelMap = {
      post: this.postModel,
      comment: this.commentModel,
      reel: this.reelModel,
      story: this.storyModel,
    };
  }

  async toggle(dto: ToggleLikeDto) {
    const { targetType, targetId, userId } = dto;
    const model = this.modelMap[targetType];
    if (!model) throw new BadRequestException('Invalid targetType');

    const doc = await model.findById(targetId);
    if (!doc) throw new BadRequestException('Target not found');

    // chuẩn hóa userId
    const userIdStr = new Types.ObjectId(userId).toString();

    // chuẩn hóa likes về string
    const rawLikes: string[] = (Array.isArray(doc.likes) ? doc.likes : [])
      .filter((x) => !!x)
      .map((x: any) => new Types.ObjectId(x).toString());

    const likes = new Set(rawLikes);

    if (likes.has(userIdStr)) {
      likes.delete(userIdStr);
    } else {
      likes.add(userIdStr);
    }

    // gán lại doc.likes = ObjectId[]
    doc.likes = Array.from(likes).map((id) => new Types.ObjectId(id)) as any;
    await doc.save();

    return {
      targetType,
      targetId,
      likes: doc.likes,
      likesCount: doc.likes.length,
    };
  }
}
