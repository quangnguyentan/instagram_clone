import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './entities/story.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { StoryGateway } from './story.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StoryController],
  providers: [StoryService, StoryGateway],
  exports: [StoryService, StoryGateway],
})
export class StoryModule {}
