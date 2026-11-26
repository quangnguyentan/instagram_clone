import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateReelDto } from './dto/create-reel.dto';
import { UpdateReelDto } from './dto/update-reel.dto';
import { Reel } from './entities/reel.entity';

@Injectable()
export class ReelService {
  constructor(
    @InjectModel(Reel.name) private readonly reelModel: Model<Reel>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(userId: string, dto: CreateReelDto, files: Express.Multer.File[] = []) {
    const video = files.find((file) => file.mimetype.startsWith('video/'));
    if (!video) throw new BadRequestException('Reel cần có một tệp video');
    const uploaded = await this.cloudinaryService.uploadFile(video);
    if (!uploaded.secure_url || !uploaded.public_id) {
      throw new BadRequestException('Không thể tải video lên');
    }

    return this.reelModel.create({
      user: new Types.ObjectId(userId),
      caption: dto.caption,
      mediaUrls: [uploaded.secure_url],
      mediaPublicIds: [uploaded.public_id],
      mediaType: 'video',
    });
  }

  async findAll(page = 1, limit = 20) {
    const [docs, total] = await Promise.all([
      this.reelModel
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'username fullname avatarUrl'),
      this.reelModel.countDocuments(),
    ]);
    return { docs, total, page, pages: Math.ceil(total / limit) };
  }

  findFeed(page = 1, limit = 20) {
    return this.findAll(page, limit);
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Mã người dùng không hợp lệ');
    }
    const filter = { user: new Types.ObjectId(userId) };
    const [docs, total] = await Promise.all([
      this.reelModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'username fullname avatarUrl'),
      this.reelModel.countDocuments(filter),
    ]);
    return { docs, total, page, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Mã reel không hợp lệ');
    }
    const reel = await this.reelModel
      .findById(id)
      .populate('user', 'username fullname avatarUrl');
    if (!reel) throw new NotFoundException('Không tìm thấy reel');
    return reel;
  }

  async update(
    id: string,
    dto: UpdateReelDto,
    userId: string,
    isAdmin = false,
  ) {
    const reel = await this.reelModel.findById(id);
    if (!reel) throw new NotFoundException('Không tìm thấy reel');
    this.assertOwner(reel, userId, isAdmin);
    reel.caption = dto.caption ?? reel.caption;
    await reel.save();
    return reel.populate('user', 'username fullname avatarUrl');
  }

  async remove(id: string, userId: string, isAdmin = false) {
    const reel = await this.reelModel.findById(id);
    if (!reel) throw new NotFoundException('Không tìm thấy reel');
    this.assertOwner(reel, userId, isAdmin);
    for (const publicId of reel.mediaPublicIds ?? []) {
      await this.cloudinaryService.deleteFile(publicId);
    }
    await reel.deleteOne();
  }

  private assertOwner(reel: Reel, userId: string, isAdmin: boolean) {
    if (reel.user.toString() !== userId && !isAdmin) {
      throw new ForbiddenException('Không có quyền quản lý reel này');
    }
  }
}
