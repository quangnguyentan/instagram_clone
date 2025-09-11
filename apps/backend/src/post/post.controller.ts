// post.controller.ts
import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { errorResponse, successResponse } from 'src/helpers/response.util';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Roles('user', 'admin')
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() dto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const post = await this.postService.create(dto, files);
      return successResponse(post, 'Tạo bài viết thành công');
    } catch (err) {
      return errorResponse('Tạo bài viết thất bại', err);
    }
  }
  @Roles('user', 'admin')
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
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const post = await this.postService.update(id, dto, files);
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
