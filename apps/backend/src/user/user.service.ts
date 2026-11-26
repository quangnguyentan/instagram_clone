import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { NotificationGateway } from 'src/notification/notification.gateway';

const publicUserFields = '-password -refreshToken';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto).then((user) => this.profile(user.id));
  }

  async findAll() {
    return this.userModel.find().select(publicUserFields).sort({ createdAt: -1 });
  }

  async search(query: string, currentUserId: string) {
    const term = query.trim();
    if (!term) return [];
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.userModel
      .find({
        _id: { $ne: new Types.ObjectId(currentUserId) },
        $or: [
          { username: { $regex: escapedTerm, $options: 'i' } },
          { fullname: { $regex: escapedTerm, $options: 'i' } },
        ],
      })
      .select('username fullname avatarUrl bio')
      .limit(20)
      .sort({ username: 1 })
      .lean();
  }

  async findByUsername(username: string) {
    return this.userModel
      .findOne({ username })
      .select(publicUserFields)
      .exec();
  }

  async profile(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Mã người dùng không hợp lệ');
    }
    const user = await this.userModel
      .findById(userId)
      .select(publicUserFields)
      .lean();
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return {
      ...user,
      followersCount: user.followers?.length ?? 0,
      followingCount: user.following?.length ?? 0,
    };
  }

  async getSuggestions(userId: string, limit = 5) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Mã người dùng không hợp lệ');
    }
    const currentUser = await this.userModel
      .findById(userId)
      .select('following');
    if (!currentUser) throw new NotFoundException('Không tìm thấy người dùng');

    const excluded = [new Types.ObjectId(userId), ...currentUser.following];
    return this.userModel
      .find({ _id: { $nin: excluded } })
      .select('username fullname avatarUrl bio')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async follow(userId: string, targetId: string) {
    this.assertValidIds(userId, targetId);
    if (userId === targetId) {
      throw new BadRequestException('Không thể tự theo dõi chính mình');
    }
    const target = await this.userModel.exists({ _id: targetId });
    if (!target) throw new NotFoundException('Không tìm thấy người dùng');
    const alreadyFollowing = await this.userModel.exists({
      _id: userId,
      following: targetId,
    });

    await Promise.all([
      this.userModel.updateOne(
        { _id: userId },
        { $addToSet: { following: new Types.ObjectId(targetId) } },
      ),
      this.userModel.updateOne(
        { _id: targetId },
        { $addToSet: { followers: new Types.ObjectId(userId) } },
      ),
    ]);
    if (!alreadyFollowing) {
      await this.notificationGateway.push(targetId, {
        user: targetId,
        type: 'follow',
        fromUser: userId,
      });
    }
    return this.profile(targetId);
  }

  async unfollow(userId: string, targetId: string) {
    this.assertValidIds(userId, targetId);
    if (userId === targetId) {
      throw new BadRequestException('Không thể bỏ theo dõi chính mình');
    }
    await Promise.all([
      this.userModel.updateOne(
        { _id: userId },
        { $pull: { following: new Types.ObjectId(targetId) } },
      ),
      this.userModel.updateOne(
        { _id: targetId },
        { $pull: { followers: new Types.ObjectId(userId) } },
      ),
    ]);
    return this.profile(targetId);
  }

  async getFollowers(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('followers', 'username fullname avatarUrl bio')
      .select('followers');
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user.followers;
  }

  async getFollowing(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('following', 'username fullname avatarUrl bio')
      .select('following');
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user.following;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const { username, fullname, bio, avatarUrl } = updateUserDto;
    const updated = await this.userModel
      .findByIdAndUpdate(
        userId,
        { username, fullname, bio, avatarUrl },
        { new: true, runValidators: true },
      )
      .select(publicUserFields);
    if (!updated) throw new NotFoundException('Không tìm thấy người dùng');
    return updated;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { username, fullname, bio, avatarUrl, role, isVerified } =
      updateUserDto;
    const updated = await this.userModel
      .findByIdAndUpdate(
        id,
        { username, fullname, bio, avatarUrl, role, isVerified },
        { new: true, runValidators: true },
      )
      .select(publicUserFields);
    if (!updated) throw new NotFoundException('Không tìm thấy người dùng');
    return updated;
  }

  async remove(id: string) {
    const removed = await this.userModel
      .findByIdAndDelete(id)
      .select(publicUserFields);
    if (!removed) throw new NotFoundException('Không tìm thấy người dùng');
    return removed;
  }

  private assertValidIds(...ids: string[]) {
    if (ids.some((id) => !Types.ObjectId.isValid(id))) {
      throw new BadRequestException('Mã người dùng không hợp lệ');
    }
  }
}
