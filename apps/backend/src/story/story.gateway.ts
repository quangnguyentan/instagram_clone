import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class StoryGateway {
  @WebSocketServer() server: Server;
  pushToFollowers(followerIds: string[], story: any) {
    followerIds.forEach((uid) =>
      this.server.to(uid.toString()).emit('new_story', story),
    );
  }
}
