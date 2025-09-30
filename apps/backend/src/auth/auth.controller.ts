import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { parseExpireToMs } from 'src/utils/time';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('register')
  async register(@Body() registerAuthDto: RegisterDto) {
    try {
      return await this.authService.register(registerAuthDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('login')
  async login(@Body() loginAuthDto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      return await this.authService.login(loginAuthDto, req, res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const result = await this.authService.refresh(req);
      const refreshMaxAge = parseExpireToMs(
        process.env.JWT_REFRESH_EXPIRE,
        7 * 24 * 60 * 60 * 1000
      );
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: refreshMaxAge,
      });
      return { message: result.message, accessToken: result.accessToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      return await this.authService.logout(req, res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
