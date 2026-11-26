import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/user/entities/user.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(userId: string, dto: CreateStoryDto, file?: Express.Multer.File) {
    if (!file || !/^(image|video)\//.test(file.mimetype)) {
      throw new BadRequestException('Chọn một ảnh hoặc video hợp lệ');
    }
    const uploaded = await this.cloudinaryService.uploadFile(file);
    if (!uploaded.secure_url || !uploaded.public_id) {
      throw new BadRequestException('Không thể tải story lên');
    }
    return this.storyModel.create({
      user: new Types.ObjectId(userId),
      mediaUrl: uploaded.secure_url,
      mediaPublicId: uploaded.public_id,
      mediaType: file.mimetype.startsWith('video/') ? 'video' : 'image',
      caption: dto.caption,
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  async feed(userId: string) {
    const user = await this.userModel.findById(userId).select('following');
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    const userIds = [new Types.ObjectId(userId), ...user.following];
    return this.storyModel
      .find({ user: { $in: userIds }, expireAt: { $gt: new Date() } })
      .populate('user', 'username fullname avatarUrl')
      .sort({ createdAt: 1 });
  }

  findAll() {
    return this.storyModel
      .find()
      .populate('user', 'username fullname avatarUrl')
      .sort({ createdAt: -1 })
      .limit(200);
  }

  async findByUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Mã người dùng không hợp lệ');
    }
    return this.storyModel
      .find({ user: userId, expireAt: { $gt: new Date() } })
      .populate('user', 'username fullname avatarUrl')
      .sort({ createdAt: 1 });
  }

  async markViewed(id: string, userId: string) {
    const story = await this.storyModel.findOneAndUpdate(
      { _id: id, expireAt: { $gt: new Date() } },
      { $addToSet: { viewers: new Types.ObjectId(userId) } },
      { new: true },
    );
    if (!story) throw new NotFoundException('Không tìm thấy story');
    return story;
  }

  async remove(id: string, userId: string, isAdmin = false) {
    const story = await this.storyModel.findById(id);
    if (!story) throw new NotFoundException('Không tìm thấy story');
    if (story.user.toString() !== userId && !isAdmin) {
      throw new ForbiddenException('Không có quyền xóa story này');
    }
    if (story.mediaPublicId) {
      await this.cloudinaryService.deleteFile(story.mediaPublicId);
    }
    await story.deleteOne();
  }
}
