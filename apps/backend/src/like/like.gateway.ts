import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LikeService } from './like.service';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@WebSocketGateway({ cors: true })
export class LikeGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly likeService: LikeService) {}

  @SubscribeMessage('toggle_like')
  async onToggle(@MessageBody() dto: ToggleLikeDto) {
    const doc = await this.likeService.toggle(dto);
    // room by target id so post detail screens can subscribe
    this.server.to(dto.targetId.toString()).emit('like_updated', {
      targetType: dto.targetType,
      targetId: dto.targetId,
      likesCount: (doc.likes || []).length,
    });
    return doc;
  }
}
