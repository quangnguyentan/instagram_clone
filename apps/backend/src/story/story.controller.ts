import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryGateway } from './story.gateway';
import { StoryService } from './story.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('story')
export class StoryController {
  constructor(
    private readonly service: StoryService,
    private readonly gateway: StoryGateway,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Roles('admin')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles('user', 'admin')
  @Get('feed')
  feed(@Req() req: any) {
    return this.service.feed(req.user.userId);
  }

  @Roles('user', 'admin')
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Roles('user', 'admin')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() dto: CreateStoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const story = await this.service.create(userId, dto, file);
    const author = await this.userModel.findById(userId).select('followers');
    const followerIds = (author?.followers || []).map((id) => id.toString());
    this.gateway.pushToFollowers(followerIds, story);
    return story;
  }

  @Roles('user', 'admin')
  @Post(':id/view')
  markViewed(@Param('id') id: string, @Req() req: any) {
    return this.service.markViewed(id, req.user.userId);
  }

  @Roles('user', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(
      id,
      req.user.userId,
      req.user.roles?.includes('admin'),
    );
  }
}
