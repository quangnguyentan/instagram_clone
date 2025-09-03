import { Controller, Get, Param, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}
  @Get('user/:userId') findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }
  @Put(':id/read') markRead(@Param('id') id: string) {
    return this.service.markRead(id);
  }
}
