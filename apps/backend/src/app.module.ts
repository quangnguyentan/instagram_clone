import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { ReelModule } from './reel/reel.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { StoryModule } from './story/story.module';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { NoteModule } from './note/note.module';
import { LikeModule } from './like/like.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI as string,
      {
        dbName: 'instagram_clone'
      }
    ),
    AuthModule,
    UserModule,
    TagModule,
    ReelModule,
    PostModule,
    CommentModule,
    StoryModule,
    NotificationModule,
    ChatModule,
    MessageModule,
    NoteModule,
    LikeModule,
    CloudinaryModule,
    SessionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
