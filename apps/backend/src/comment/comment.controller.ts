import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CommentService } from './comment.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles('user', 'admin')
  @Post('reel/:reelId')
  createReelComment(
    @Param('reelId') reelId: string,
    @Body() dto: { content: string },
    @Req() req: any,
  ) {
    return this.commentService.createReelComment({
      reel: reelId,
      content: dto.content,
      user: req.user.userId,
    });
  }

  @Roles('user', 'admin')
  @Get('reel/:reelId')
  findByReel(@Param('reelId') reelId: string) {
    return this.commentService.findByReel(reelId);
  }

  @Roles('user', 'admin')
  @Post()
  create(
    @Body() dto: { post: string; content: string; parent?: string | null },
    @Req() req: any,
  ) {
    return this.commentService.create({
      ...dto,
      user: req.user.userId,
    });
  }

  @Roles('user', 'admin')
  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Roles('user', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: { content: string },
    @Req() req: any,
  ) {
    return this.commentService.update(
      id,
      dto,
      req.user.userId,
      req.user.roles?.includes('admin'),
    );
  }

  @Roles('user', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.commentService.remove(
      id,
      req.user.userId,
      req.user.roles?.includes('admin'),
    );
  }
}
