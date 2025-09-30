import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entities/comment.entity';
import { CommentGateway } from './comment.gateway';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    NotificationModule,
    UserModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentGateway],
  exports: [CommentService, CommentGateway],
})
export class CommentModule { }
