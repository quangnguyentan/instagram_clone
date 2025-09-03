import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/comment/entities/comment.entity';
import { Post, PostSchema } from 'src/post/entities/post.entity';
import { Reel, ReelSchema } from 'src/reel/entities/reel.entity';
import { Story, StorySchema } from 'src/story/entities/story.entity';
import { LikeGateway } from './like.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Reel.name, schema: ReelSchema },
      { name: Story.name, schema: StorySchema },
    ]),
  ],
  controllers: [LikeController],
  providers: [LikeService, LikeGateway],
  exports: [LikeService, LikeGateway],
})
export class LikeModule {}
