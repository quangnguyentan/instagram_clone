import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }
  async findByUsername(username: string) {
    return await this.userModel.findOne({ username }).exec();

  }

  async profile(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async getSuggestions(userId: string, limit = 5) {
    const currentUser = await this.userModel
      .findById(userId)
      .select('following');
    if (!currentUser) throw new Error('User không tồn tại');

    const excluded = [new Types.ObjectId(userId), ...currentUser.following];

    let candidateIds: Types.ObjectId[] = [];

    if (currentUser.following.length > 0) {
      // Lấy danh sách bạn bè của những người mình follow
      const friendsOfFollowing = await this.userModel.aggregate([
        { $match: { _id: { $in: currentUser.following } } },
        { $unwind: { path: '$following', preserveNullAndEmptyArrays: true } },
        { $group: { _id: null, following: { $addToSet: '$following' } } },
      ]);

      candidateIds =
        friendsOfFollowing.length > 0 ? friendsOfFollowing[0].following : [];
    }

    let suggestions: User[] = [];

    if (candidateIds.length > 0) {
      // Gợi ý từ bạn của bạn bè
      suggestions = await this.userModel.aggregate([
        { $match: { _id: { $nin: excluded, $in: candidateIds } } },
        { $addFields: { followersCount: { $size: '$followers' } } },
        { $sort: { followersCount: -1 } },
        { $limit: limit },
        { $project: { password: 0, refreshToken: 0 } },
      ]);
    }

    // Nếu chưa đủ (hoặc không có) → fallback sang random global
    if (suggestions.length < limit) {
      const fallback = await this.userModel.aggregate([
        { $match: { _id: { $nin: excluded } } },
        { $addFields: { followersCount: { $size: '$followers' } } },
        { $sort: { followersCount: -1 } },
        { $limit: limit - suggestions.length },
        { $project: { password: 0, refreshToken: 0 } },
      ]);

      suggestions = [...suggestions, ...fallback];
    }

    return suggestions;
  }

  // async getSuggestions(userId: string, limit = 5) {
  //   const currentUser = await this.userModel
  //     .findById(userId)
  //     .select('following');
  //   if (!currentUser) throw new Error('User không tồn tại');

  //   let suggestions: User[] = [];

  //   const excluded = [new Types.ObjectId(userId), ...currentUser.following];

  //   if (currentUser.following.length > 0) {
  //     //  Bạn của bạn bè + ưu tiên người có nhiều followers
  //     const friendsOfFollowing = await this.userModel.aggregate([
  //       { $match: { _id: { $in: currentUser.following } } },
  //       { $unwind: '$following' },
  //       { $group: { _id: null, following: { $addToSet: '$following' } } },
  //     ]);

  //     const candidateIds =
  //       friendsOfFollowing.length > 0 ? friendsOfFollowing[0].following : [];

  //     suggestions = await this.userModel.aggregate([
  //       {
  //         $match: {
  //           _id: { $nin: excluded, $in: candidateIds },
  //         },
  //       },
  //       {
  //         $addFields: {
  //           followersCount: { $size: '$followers' },
  //         },
  //       },
  //       { $sort: { followersCount: -1 } }, // ưu tiên nhiều followers
  //       { $sample: { size: limit } }, // random trong nhóm ưu tiên
  //       {
  //         $project: {
  //           password: 0,
  //           refreshToken: 0,
  //         },
  //       },
  //     ]);
  //   } else {
  //     //  Nếu chưa follow ai → random từ tất cả user nhưng ưu tiên người có nhiều followers
  //     suggestions = await this.userModel.aggregate([
  //       { $match: { _id: { $ne: new Types.ObjectId(userId) } } },
  //       {
  //         $addFields: {
  //           followersCount: { $size: '$followers' },
  //         },
  //       },
  //       { $sort: { followersCount: -1 } },
  //       { $sample: { size: limit } },
  //       {
  //         $project: {
  //           password: 0,
  //           refreshToken: 0,
  //         },
  //       },
  //     ]);
  //   }

  //   return suggestions;
  // }
  async follow(userId: string, targetId: string) {
    if (userId === targetId) throw new Error('Không thể tự follow chính mình');

    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { following: targetId },
    });

    await this.userModel.findByIdAndUpdate(targetId, {
      $addToSet: { followers: userId },
    });

    return { message: 'Follow thành công' };
  }

  async unfollow(userId: string, targetId: string) {
    if (userId === targetId)
      throw new Error('Không thể tự unfollow chính mình');

    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { following: targetId },
    });

    await this.userModel.findByIdAndUpdate(targetId, {
      $pull: { followers: userId },
    });

    return { message: 'Unfollow thành công' };
  }

  async getFollowers(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('followers', 'username fullname avatarUrl');
    if (!user) throw new Error('User không tồn tại');
    return user.followers;
  }

  async getFollowing(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('following', 'username fullname avatarUrl');
    if (!user) throw new Error('User không tồn tại');
    return user.following;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
