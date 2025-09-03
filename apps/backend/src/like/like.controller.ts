import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly service: LikeService) {}
  @Post('toggle') toggle(@Body() dto: ToggleLikeDto) {
    return this.service.toggle(dto);
  }
}
