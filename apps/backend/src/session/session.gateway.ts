import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: { origin: true } })
@Injectable()
export class SessionGateway {
    @WebSocketServer() server: Server;

    // Gửi sự kiện force_logout khi session bị thu hồi
    forceLogout(socketId: string, reason?: string) {
        console.log(socketId, reason, "forceLogout called");
        if (!this.server) return;
        this.server.to(socketId).emit('force_logout', { reason: reason || 'You have been logged out.' });
    }

    // Xử lý khi client kết nối (tương tự join_room)
    @SubscribeMessage('register_session')
    handleRegisterSession(client: Socket, sessionId: string) {
        console.log(`Client ${client.id} registered session ${sessionId}`);
        client.join(sessionId); // Gán client vào room dựa trên sessionId
    }

    // Xử lý khi client ngắt kết nối hoặc session bị thu hồi
    @SubscribeMessage('unregister_session')
    handleUnregisterSession(client: Socket, sessionId: string) {
        console.log(`Client ${client.id} unregistered session ${sessionId}`);
        client.leave(sessionId);
    }

    // Xử lý sự kiện khi session được tạo (tùy chọn, nếu cần thông báo)
    @OnEvent('session.created')
    handleSessionCreated(session: any) {
        console.log('Session created event:', session);
        this.server.to(session.socketId).emit('session.created', session);
    }

    // Xử lý sự kiện khi session bị thu hồi
    @OnEvent('session.revoked')
    handleSessionRevoked(session: any) {
        console.log('Session revoked event:', session);
        if (session.socketId) {
            this.forceLogout(session.socketId, 'Session has been revoked due to new login.');
        }
    }
}