import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Roles('user', 'admin')
  @Get('chat/:chatId')
  findByChat(@Param('chatId') chatId: string, @Req() req: any) {
    return this.messageService.findByChat(chatId, req.user.userId);
  }

  @Roles('user', 'admin')
  @Post()
  create(@Body() dto: CreateMessageDto, @Req() req: any) {
    return this.messageService.create(dto, req.user.userId);
  }
}
