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
    if (comment.post) {
      this.server.to(comment.post.toString()).emit('comment.created', comment);
    }
  }

  @OnEvent('comment.updated')
  handleUpdated(comment: Comment) {
    const targetId = comment.post?.toString() ?? comment.reel?.toString();
    if (targetId) {
      this.server
        .to(targetId)
        .emit(comment.post ? 'comment.updated' : 'reel.comment.updated', comment);
    }
  }

  @OnEvent('reel.comment.created')
  handleReelCreated(comment: Comment) {
    if (comment.reel) {
      this.server
        .to(comment.reel.toString())
        .emit('reel.comment.created', comment);
    }
  }

  @OnEvent('comment.deleted')
  handleDeleted(payload: { id: string; postId?: string; reelId?: string }) {
    const targetId = payload.postId ?? payload.reelId;
    if (targetId) {
      this.server
        .to(targetId)
        .emit(payload.postId ? 'comment.deleted' : 'reel.comment.deleted', payload);
    }
  }
}
