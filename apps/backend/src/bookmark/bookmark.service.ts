import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bookmark } from './entities/bookmark.entity';
import { Reel } from 'src/reel/entities/reel.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
    @InjectModel(Reel.name) private reelModel: Model<Reel>,
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
      .populate('reel')
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

  async createReel(userId: string, reelId: string) {
    const reel = await this.reelModel.findById(reelId).select('_id');
    if (!reel) return null;
    const existing = await this.bookmarkModel.findOne({
      user: userId,
      reel: reelId,
    });
    if (existing) return existing;
    return new this.bookmarkModel({
      user: new Types.ObjectId(userId),
      reel: new Types.ObjectId(reelId),
    }).save();
  }

  async removeReel(userId: string, reelId: string) {
    return this.bookmarkModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
      reel: new Types.ObjectId(reelId),
    });
  }

}
