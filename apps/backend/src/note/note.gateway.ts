import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NoteGateway {
  @WebSocketServer() server: Server;
  pushToFollowers(followerIds: string[], note: any) {
    followerIds.forEach((uid) =>
      this.server.to(uid.toString()).emit('new_note', note),
    );
  }
}
