import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.chatService.findByUser(userId);
  }

  @Post()
  create(@Body('members') members: string[]) {
    return this.chatService.create(members);
  }
}
