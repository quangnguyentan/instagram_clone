// bookmark.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { Bookmark, BookmarkSchema } from './entities/bookmark.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bookmark.name, schema: BookmarkSchema }])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [BookmarkService],
})
export class BookmarkModule { }
