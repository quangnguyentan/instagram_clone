import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entities/comment.entity';
import { CommentGateway } from './comment.gateway';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { Post, PostSchema } from 'src/post/entities/post.entity';
import { Reel, ReelSchema } from 'src/reel/entities/reel.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
      { name: Reel.name, schema: ReelSchema },
    ]),
    NotificationModule,
    UserModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentGateway],
  exports: [CommentService, CommentGateway],
})
export class CommentModule { }
