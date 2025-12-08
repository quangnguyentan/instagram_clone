import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
  ) { }

  // Lưu (bookmark)
  async create(userId: string, postId: string) {
    const exists = await this.bookmarkModel.findOne({
      user: userId,
      post: postId,
    });
    if (exists) return exists; // đã bookmark thì trả về luôn

    const bookmark = new this.bookmarkModel({
      user: new Types.ObjectId(userId),
      post: new Types.ObjectId(postId),
    });
    return bookmark.save();
  }

  // Bỏ lưu (unbookmark)
  async remove(userId: string, postId: string) {
    return this.bookmarkModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
      post: new Types.ObjectId(postId),
    });
  }

  // Lấy tất cả bookmark của user
  async findAllByUser(userId: string) {
    return this.bookmarkModel
      .find({ user: userId })
      .populate('post')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Kiểm tra 1 post đã được bookmark chưa
  async isBookmarked(userId: string, postId: string) {
    return this.bookmarkModel.exists({
      user: new Types.ObjectId(userId),
      post: new Types.ObjectId(postId),
    });
  }
}
