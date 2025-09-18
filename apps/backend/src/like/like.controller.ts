import { Controller, Post, Body } from '@nestjs/common';
import { LikeService } from './like.service';
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { LikeGateway } from './like.gateway';

@Controller('likes')
export class LikeController {
  constructor(
    private readonly service: LikeService,
    private readonly gateway: LikeGateway, // inject gateway
  ) {}

  @Post('toggle')
  async toggle(@Body() dto: ToggleLikeDto) {
    const result = await this.service.toggle(dto);
    this.gateway.server
      .to(result.targetId.toString())
      .emit('like_updated', result);
    return result;
  }
}
