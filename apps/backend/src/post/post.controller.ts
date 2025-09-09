// post.controller.ts
import { Controller, Get, Post as HttpPost, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { errorResponse, successResponse } from 'src/helper/response.util';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @HttpPost()
  async create(@Body() dto: CreatePostDto) {
    try {
      const post = await this.postService.create(dto);
      return successResponse(post, 'Tạo bài viết thành công');
    } catch (err) {
      return errorResponse('Tạo bài viết thất bại', err);
    }
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const posts = await this.postService.findAll(Number(page), Number(limit));
      return successResponse(posts, 'Lấy danh sách bài viết thành công');
    } catch (err) {
      return errorResponse('Không lấy được danh sách bài viết', err);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const post = await this.postService.findOne(id);
      return successResponse(post, 'Lấy bài viết thành công');
    } catch (err) {
      return errorResponse('Không tìm thấy bài viết', err);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    try {
      const post = await this.postService.update(id, dto);
      return successResponse(post, 'Cập nhật bài viết thành công');
    } catch (err) {
      return errorResponse('Cập nhật bài viết thất bại', err);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.postService.remove(id);
      return successResponse(null, 'Xóa bài viết thành công');
    } catch (err) {
      return errorResponse('Xóa bài viết thất bại', err);
    }
  }
}
