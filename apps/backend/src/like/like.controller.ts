import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { LikeGateway } from './like.gateway';
import { LikeService } from './like.service';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('likes')
export class LikeController {
  constructor(
    private readonly service: LikeService,
    private readonly gateway: LikeGateway,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Roles('user', 'admin')
  @Post('toggle')
  async toggle(@Body() dto: ToggleLikeDto, @Req() req: any) {
    const userId = req.user.userId;
    const result = await this.service.toggle({ ...dto, userId });
    this.gateway.server
      .to(result.targetId.toString())
      .emit('like_updated', result);

    if (result.isLiked && result.ownerId && result.ownerId !== userId) {
      await this.notificationGateway.push(result.ownerId, {
        user: result.ownerId,
        type: 'like',
        fromUser: userId,
        post: dto.targetType === 'post' ? dto.targetId : undefined,
      });
    }
    return result;
  }
}
