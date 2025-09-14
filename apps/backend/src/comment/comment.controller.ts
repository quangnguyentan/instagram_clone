// src/comment/comment.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  create(@Body() dto: { post: string; user: string; content: string; parent?: string }) {
    return this.commentService.create(dto);
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    return await this.commentService.findByPost(postId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { content: string }) {
    return this.commentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
