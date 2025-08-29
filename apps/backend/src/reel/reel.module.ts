import { Module } from '@nestjs/common';
import { ReelService } from './reel.service';
import { ReelController } from './reel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reel, ReelSchema } from './entities/reel.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reel.name, schema: ReelSchema }]),
  ],
  controllers: [ReelController],
  providers: [ReelService],
})
export class ReelModule {}
