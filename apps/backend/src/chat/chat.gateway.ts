// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) { }

  @SubscribeMessage('join_chat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(chatId);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messageService.create(dto);
    this.server.to(dto.chatId.toString()).emit('receive_message', message);
    return message;
  }
}
