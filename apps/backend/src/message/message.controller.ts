import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('chat/:chatId')
  findByChat(@Param('chatId') chatId: string) {
    return this.messageService.findByChat(chatId);
  }

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messageService.create(dto);
  }
}
