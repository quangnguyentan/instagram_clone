import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateReelDto } from './dto/create-reel.dto';
import { UpdateReelDto } from './dto/update-reel.dto';
import { ReelService } from './reel.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reel')
export class ReelController {
  constructor(private readonly reelService: ReelService) {}

  @Roles('user', 'admin')
  @Post()
  @UseInterceptors(FilesInterceptor('files', 1))
  create(
    @Body() dto: CreateReelDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    return this.reelService.create(req.user.userId, dto, files);
  }

  @Roles('admin')
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.reelService.findAll(Number(page), Number(limit));
  }

  @Roles('user', 'admin')
  @Get('feed')
  findFeed(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.reelService.findFeed(Number(page), Number(limit));
  }

  @Roles('user', 'admin')
  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.reelService.findByUser(
      userId,
      Number(page),
      Number(limit),
    );
  }

  @Roles('user', 'admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reelService.findOne(id);
  }

  @Roles('user', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReelDto,
    @Req() req: any,
  ) {
    return this.reelService.update(
      id,
      dto,
      req.user.userId,
      req.user.roles?.includes('admin'),
    );
  }

  @Roles('user', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.reelService.remove(
      id,
      req.user.userId,
      req.user.roles?.includes('admin'),
    );
  }
}
