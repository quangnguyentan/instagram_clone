// post.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './entities/post.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ToggleLikeDto } from 'src/like/dto/toggle-like.dto';
import { User, UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: PaginateModel<PostDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreatePostDto,
    files: Express.Multer.File[] = [],
  ): Promise<Post> {
    if (!files.length) throw new BadRequestException('Cần tải lên ít nhất một tệp');
    const uploadedMedia = [];
    for (const file of files) {
      const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);
      if (!cloudinaryResponse.secure_url) {
        throw new BadRequestException('Tải lên tệp tin thất bại');
      }
      (uploadedMedia as { url: string; public_id: string }[]).push({
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
        mediaType: file.mimetype.split('/')[0],
      } as { url: string; public_id: string; mediaType: 'image' | 'video' });
    }

    const post = new this.postModel({
      ...dto,
      media: uploadedMedia,
    });
    return post.save();
  }

  async findAll(page = 1, limit = 10) {
    return this.postModel.paginate(
      {},
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'username fullname avatarUrl bio' },
          { path: 'tags' },
        ],
      },
    );
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('user', 'username fullname avatarUrl bio')
      .populate('tags');
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    return this.postModel.paginate(
      { user: userId },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'username fullname avatarUrl bio' },
          { path: 'tags' },
        ],
      },
    );
  }

  async explore(page = 1, limit = 20) {
    return this.postModel.paginate(
      {},
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'username fullname avatarUrl bio' },
          { path: 'tags' },
        ],
      },
    );
  }

  async search(query: string, page = 1, limit = 20) {
    const term = query.trim();
    if (!term) {
      return this.postModel.paginate(
        { _id: { $exists: false } },
        { page, limit, populate: { path: 'user', select: 'username fullname avatarUrl' } },
      );
    }
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.postModel.paginate(
      { caption: { $regex: escapedTerm, $options: 'i' } },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: { path: 'user', select: 'username fullname avatarUrl' },
      },
    );
  }

  async update(
    id: string,
    dto: UpdatePostDto,
    files: Express.Multer.File[] = [],
    userId: string,
    isAdmin = false,
  ): Promise<Post> {
    const oldPost = await this.postModel.findById(id);
    if (!oldPost) throw new NotFoundException('Post not found');
    if (oldPost.user.toString() !== userId && !isAdmin) {
      throw new ForbiddenException('Không có quyền chỉnh sửa bài viết này');
    }

    if (files.length && oldPost.media?.length) {
      for (const media of oldPost.media) {
        await this.cloudinaryService.deleteFile(media.public_id);
      }
    }

    const uploadedMedia = [];
    for (const file of files) {
      const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);
      if (!cloudinaryResponse.secure_url) {
        throw new BadRequestException('Tải lên tệp tin thất bại');
      }
      (uploadedMedia as { url: string; public_id: string }[]).push({
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
        mediaType: file.mimetype.split('/')[0],
      } as { url: string; public_id: string; mediaType: 'image' | 'video' });
    }
    const changes = files.length
      ? { ...dto, media: uploadedMedia }
      : { ...dto };
    const post = await this.postModel.findByIdAndUpdate(
      id,
      changes,
      { new: true },
    );
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async remove(id: string, userId: string, isAdmin = false): Promise<void> {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    if (post.user.toString() !== userId && !isAdmin) {
      throw new ForbiddenException('Không có quyền xóa bài viết này');
    }
    // xoá ảnh trên Cloudinary
    if (post.media?.length) {
      for (const media of post.media) {
        await this.cloudinaryService.deleteFile(media.public_id);
      }
    }
    await this.postModel.findByIdAndDelete(id);
  }

  async toggleLike(
    id: string,
    dto: ToggleLikeDto & { userId: string },
  ): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    const likes = new Set((post.likes || []).map((x: any) => x.toString()));
    if (likes.has(dto.userId)) likes.delete(dto.userId);
    else likes.add(dto.userId);
    post.likes = Array.from(likes) as any;
    await post.save();
    return post;
  }
  // post.service.ts
  async getFeed(userId: string, page: number, limit: number) {
    const currentUser = await this.userModel
      .findById(userId)
      .select('following');
    if (!currentUser) throw new Error('User không tồn tại');

    // lấy user nổi tiếng
    const popularUsers = await this.userModel
      .find({ $expr: { $gt: [{ $size: '$followers' }, 10] } })
      .select('_id');
    const popularUserIds = popularUsers.map((u) => u._id);

    // thêm cả chính mình vào danh sách
    const targetUserIds = [
      ...new Set([
        userId,
        ...currentUser.following.map((id) => id.toString()),
        ...popularUserIds.map((id: any) => id.toString()),
      ]),
    ];

    // query bài viết
    return this.postModel.paginate(
      { user: { $in: targetUserIds } },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'username fullname avatarUrl bio' },
          { path: 'tags' },
          { path: 'likes', select: 'username fullname avatarUrl' },
        ],
      },
    );
  }
}
