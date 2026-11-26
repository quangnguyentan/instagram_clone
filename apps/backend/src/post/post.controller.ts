import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { successResponse } from 'src/helpers/response.util';
import { ToggleLikeDto } from 'src/like/dto/toggle-like.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Roles('user', 'admin')
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async create(
    @Body() dto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    const post = await this.postService.create(
      { ...dto, user: req.user.userId },
      files,
    );
    return successResponse(post, 'Tạo bài viết thành công');
  }

  @Roles('admin')
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return successResponse(
      await this.postService.findAll(Number(page), Number(limit)),
      'Lấy danh sách bài viết thành công',
    );
  }

  @Roles('user', 'admin')
  @Get('feed')
  async getFeed(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
  ) {
    return successResponse(
      await this.postService.getFeed(
        req.user.userId,
        Number(page),
        Number(limit),
      ),
      'Lấy bài viết feed thành công',
    );
  }

  @Roles('user', 'admin')
  @Get('explore')
  async explore(@Query('page') page = 1, @Query('limit') limit = 20) {
    return successResponse(
      await this.postService.explore(Number(page), Number(limit)),
      'Lấy bài viết khám phá thành công',
    );
  }

  @Roles('user', 'admin')
  @Get('search')
  async search(
    @Query('q') query = '',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return successResponse(
      await this.postService.search(
        query,
        Number(page),
        Number(limit),
      ),
      'Tìm bài viết thành công',
    );
  }

  @Roles('user', 'admin')
  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return successResponse(
      await this.postService.findByUser(
        userId,
        Number(page),
        Number(limit),
      ),
      'Lấy bài viết của người dùng thành công',
    );
  }

  @Roles('user', 'admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return successResponse(
      await this.postService.findOne(id),
      'Lấy bài viết thành công',
    );
  }

  @Roles('user', 'admin')
  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 10))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    const post = await this.postService.update(
      id,
      dto,
      files,
      req.user.userId,
      req.user.roles?.includes('admin'),
    );
    return successResponse(post, 'Cập nhật bài viết thành công');
  }

  @Roles('user', 'admin')
  @Patch(':id')
  async toggleLike(
    @Param('id') id: string,
    @Body() dto: ToggleLikeDto,
    @Req() req: any,
  ) {
    return successResponse(
      await this.postService.toggleLike(id, {
        ...dto,
        userId: req.user.userId,
      }),
      'Thích bài viết thành công',
    );
  }

  @Roles('user', 'admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.postService.remove(
      id,
      req.user.userId,
      req.user.roles?.includes('admin'),
    );
    return successResponse(null, 'Xóa bài viết thành công');
  }
}
