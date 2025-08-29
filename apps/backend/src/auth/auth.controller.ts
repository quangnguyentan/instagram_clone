import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerAuthDto: RegisterDto) {
    try {
      return await this.authService.register(registerAuthDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('login')
  async login(@Body() loginAuthDto: LoginDto) {
    try {
      return await this.authService.login(loginAuthDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      return await this.authService.logout(req, res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
