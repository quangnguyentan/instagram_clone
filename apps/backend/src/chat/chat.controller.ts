import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Roles('user', 'admin')
  @Get()
  findForCurrentUser(@Req() req: any) {
    return this.chatService.findByUser(req.user.userId);
  }

  @Roles('user', 'admin')
  @Post()
  create(@Body('recipientId') recipientId: string, @Req() req: any) {
    return this.chatService.createDirect(req.user.userId, recipientId);
  }
}
