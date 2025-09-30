// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  socketId?: string;

  @IsString()
  deviceType?: string; // 'mobile' | 'desktop' | 'tablet' | customq

  @IsString()
  userAgent?: string;
}
