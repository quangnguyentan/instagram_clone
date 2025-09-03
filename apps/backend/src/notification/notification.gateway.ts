// src/notification/notification.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  async push(userId: string, dto: CreateNotificationDto) {
    const notif = await this.notificationService.create(dto);
    this.server.to(userId.toString()).emit('new_notification', notif);
    return notif;
  }
}
