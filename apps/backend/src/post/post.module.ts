import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { User, UserSchema } from 'src/user/entities/user.entity';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
