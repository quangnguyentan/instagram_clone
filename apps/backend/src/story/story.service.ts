import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from './entities/story.entity';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(dto: CreateStoryDto) {
    const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return this.storyModel.create({ ...dto, expireAt });
  }

  findByUser(userId: string) {
    return this.storyModel.find({ user: userId });
  }
}
