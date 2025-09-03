import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryGateway } from './story.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';

@Controller('story')
export class StoryController {
  constructor(
    private readonly service: StoryService,
    private readonly gateway: StoryGateway,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Get('user/:userId') findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Post()
  async create(@Body() dto: CreateStoryDto) {
    const story = await this.service.create(dto);
    // get followers of author to push
    const author = await this.userModel.findById(dto.user);
    const followerIds = (author?.followers || []).map((x: any) => x.toString());
    this.gateway.pushToFollowers(followerIds, story);
    return story;
  }
}
