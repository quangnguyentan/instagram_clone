import { Module } from '@nestjs/common';
import { ReelService } from './reel.service';
import { ReelController } from './reel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reel, ReelSchema } from './entities/reel.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Reel.name, schema: ReelSchema }]),
  ],
  controllers: [ReelController],
  providers: [ReelService],
})
export class ReelModule {}
