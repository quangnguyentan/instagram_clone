import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { successResponse, errorResponse } from 'src/helpers/response.util';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) { }

  @Post(':postId')
  async create(@Req() req: any, @Param('postId') postId: string) {
    try {
      const userId = req.user.userId;
      const bookmark = await this.bookmarkService.create(userId, postId);
      return successResponse(bookmark, 'Đã lưu bài viết');
    } catch (err) {
      return errorResponse('Không thể lưu bài viết', err);
    }
  }

  @Delete(':postId')
  async remove(@Req() req: any, @Param('postId') postId: string) {
    try {
      const userId = req.user.userId;
      await this.bookmarkService.remove(userId, postId);
      return successResponse(null, 'Đã bỏ lưu bài viết');
    } catch (err) {
      return errorResponse('Không thể bỏ lưu bài viết', err);
    }
  }

  @Get()
  async findAllByUser(@Req() req: any) {
    try {
      const userId = req.user.userId;
      const bookmarks = await this.bookmarkService.findAllByUser(userId);
      return successResponse(bookmarks, 'Danh sách bài viết đã lưu');
    } catch (err) {
      return errorResponse('Không lấy được danh sách bài viết đã lưu', err);
    }
  }

  @Get(':postId/check')
  async check(@Req() req: any, @Param('postId') postId: string) {
    try {
      const userId = req.user.userId;

      const isBookmarked = await this.bookmarkService.isBookmarked(userId, postId);
      return successResponse({ isBookmarked: !!isBookmarked }, 'Kiểm tra bookmark thành công');
    } catch (err) {
      return errorResponse('Không thể kiểm tra bookmark', err);
    }
  }
}
