// src/comment/comment.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@WebSocketGateway({ cors: true })
export class CommentGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commentService: CommentService) {}

  @SubscribeMessage('new_comment')
  async onNewComment(@MessageBody() dto: CreateCommentDto) {
    const cmt = await this.commentService.create(dto);
    this.server.to(dto.post.toString()).emit('comment_added', cmt);
    return cmt;
  }
}
