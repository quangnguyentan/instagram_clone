import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { NotificationService } from './notification.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Roles('user', 'admin')
  @Get()
  findForCurrentUser(@Req() req: any) {
    return this.service.findByUser(req.user.userId);
  }

  @Roles('user', 'admin')
  @Put('read-all')
  markAllRead(@Req() req: any) {
    return this.service.markAllRead(req.user.userId);
  }

  @Roles('user', 'admin')
  @Put(':id/read')
  markRead(@Param('id') id: string, @Req() req: any) {
    return this.service.markRead(id, req.user.userId);
  }
}
