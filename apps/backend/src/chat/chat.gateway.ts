import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionsService } from 'src/session/session.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (typeof token !== 'string' || !token) {
      client.emit('auth_error', { message: 'Authentication required' });
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const session = await this.sessionsService.findById(payload.sid);
      if (!payload.uid || !session || session.revoked) {
        throw new Error('Invalid session');
      }
      client.data.userId = payload.uid;
      client.data.sessionId = payload.sid;
      const activeSession = await this.sessionsService.setSocketId(
        payload.sid,
        client.id,
      );
      if (!activeSession) throw new Error('Invalid session');
      client.join(payload.uid);
    } catch {
      client.emit('auth_error', { message: 'Invalid authentication' });
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    const sessionId = client.data.sessionId as string | undefined;
    if (sessionId) {
      await this.sessionsService.clearSocketId(sessionId, client.id);
    }
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId as string | undefined;
    if (!userId) {
      client.disconnect(true);
      return;
    }
    await this.chatService.assertMember(chatId, userId);
    client.join(chatId);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId as string | undefined;
    if (!userId) {
      client.disconnect(true);
      return;
    }
    const message = await this.messageService.create(dto, userId);
    this.server.to(dto.chatId).emit('receive_message', message);
    return message;
  }
}
