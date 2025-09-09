import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ToggleLikeDto } from './dto/toggle-like.dto';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Reel } from 'src/reel/entities/reel.entity';
import { Story } from 'src/story/entities/story.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    @InjectModel(Reel.name) private readonly reelModel: Model<Reel>,
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
  ) { }

  async toggle(dto: ToggleLikeDto) {
    const { targetType, targetId, userId } = dto;
    const map: any = {
      post: this.postModel,
      comment: this.commentModel,
      reel: this.reelModel,
      story: this.storyModel,
    };
    const model = map[targetType];
    if (!model) throw new BadRequestException('Invalid targetType');

    const doc = await model.findById(targetId);
    if (!doc) throw new BadRequestException('Target not found');

    const likes = new Set((doc.likes || []).map((x: any) => x.toString()));
    if (likes.has(userId)) likes.delete(userId);
    else likes.add(userId);
    doc.likes = Array.from(likes) as any;
    await doc.save();
    return doc;
  }
}
