import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Roles('user', 'admin')
  @Get()
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Roles('user', 'admin')
  @Get('profile')
  async profile(@Req() req: any) {
    const user = req?.user;
    return await this.userService.profile(user?.userId);
  }
  @Roles('user', 'admin')
  @Post('follow/:targetId')
  async follow(@Req() req: any, @Param('targetId') targetId: string) {
    const userId = req.user.userId;
    return await this.userService.follow(userId, targetId);
  }

  @Roles('user', 'admin')
  @Post('unfollow/:targetId')
  async unfollow(@Req() req: any, @Param('targetId') targetId: string) {
    const userId = req.user.userId;
    return await this.userService.unfollow(userId, targetId);
  }

  @Roles('user', 'admin')
  @Get(':id/followers')
  async getFollowers(@Param('id') id: string) {
    return await this.userService.getFollowers(id);
  }

  @Roles('user', 'admin')
  @Get(':id/following')
  async getFollowing(@Param('id') id: string) {
    return await this.userService.getFollowing(id);
  }

  @Roles('user', 'admin')
  @Get('suggestions')
  async getSuggestions(@Req() req: any) {
    try {
      const userId = req?.user?.userId;
      return await this.userService.getSuggestions(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
