// post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: PaginateModel<PostDocument>,
  ) { }

  async create(dto: CreatePostDto): Promise<Post> {
    const post = new this.postModel(dto);
    return post.save();
  }

  async findAll(page = 1, limit = 10) {
    return this.postModel.paginate({}, { page, limit, sort: { createdAt: -1 }, populate: ['user', 'tags'] });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).populate(['user', 'tags']);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postModel.findByIdAndUpdate(id, dto, { new: true });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async remove(id: string): Promise<void> {
    const result = await this.postModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Post not found');
  }
}
