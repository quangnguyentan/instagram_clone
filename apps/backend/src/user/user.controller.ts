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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles('user', 'admin')
  @Get('search')
  search(@Query('q') query = '', @Req() req: any) {
    return this.userService.search(query, req.user.userId);
  }

  @Roles('user', 'admin')
  @Get('suggestions')
  getSuggestions(@Req() req: any) {
    return this.userService.getSuggestions(req.user.userId);
  }

  @Roles('user', 'admin')
  @Get('profile')
  getOwnProfile(@Req() req: any) {
    return this.userService.profile(req.user.userId);
  }

  @Roles('user', 'admin')
  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Roles('user', 'admin')
  @Patch('profile')
  updateOwnProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.userId, dto);
  }

  @Roles('user', 'admin')
  @Post('follow/:targetId')
  follow(@Req() req: any, @Param('targetId') targetId: string) {
    return this.userService.follow(req.user.userId, targetId);
  }

  @Roles('user', 'admin')
  @Post('unfollow/:targetId')
  unfollow(@Req() req: any, @Param('targetId') targetId: string) {
    return this.userService.unfollow(req.user.userId, targetId);
  }

  @Roles('user', 'admin')
  @Get(':id/followers')
  getFollowers(@Param('id') id: string) {
    return this.userService.getFollowers(id);
  }

  @Roles('user', 'admin')
  @Get(':id/following')
  getFollowing(@Param('id') id: string) {
    return this.userService.getFollowing(id);
  }

  @Roles('user', 'admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.profile(id);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
