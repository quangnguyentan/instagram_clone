// src/comment/comment.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Comment } from './entities/comment.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class CommentGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, postId: string) {
    client.join(postId);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(client: Socket, postId: string) {
    client.leave(postId);
  }

  @OnEvent('comment.created')
  handleCreated(comment: Comment) {
    this.server.to(comment.post.toString()).emit('comment.created', comment);
  }

  @OnEvent('comment.updated')
  handleUpdated(comment: Comment) {
    this.server.to(comment.post.toString()).emit('comment.updated', comment);
  }

  @OnEvent('comment.deleted')
  handleDeleted(payload: { id: string; postId: string }) {
    this.server.to(payload.postId).emit('comment.deleted', payload);
  }
}
