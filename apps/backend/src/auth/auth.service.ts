import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { generateAccessToken, generateRefreshToken } from 'src/middlewares/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterDto) {
    const { username, email, password, fullname, ...userData } =
      registerAuthDto;
    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const existingFullname = await this.userModel.findOne({ fullname });
    if (existingFullname) {
      throw new BadRequestException('Tên đầy đủ đã tồn tại');
    }
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      throw new BadRequestException('Tên người dùng đã tồn tại');
    }
    const user = await this.userModel.create({
      ...userData,
      username,
      email,
      password,
      fullname,
    });
    await user.save();
    return user;
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user: UserDocument | null = await this.userModel.findOne({ email });
    if (user && (await user.isCorrectPassword(password))) {
      const { password, ...userData } = user.toObject();
      const accessToken = generateAccessToken(
        user._id as string,
        user.role,
        user.email,
      );
      const refreshToken = generateRefreshToken(user._id as string, user.email);
      await this.userModel.findByIdAndUpdate(
        user._id,
        {
          refreshToken,
        },
        { new: true },
      );

      // res.cookie('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production', // chỉ bật secure khi chạy https
      //   sameSite: 'strict',
      //   // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      //   maxAge: 1 * 60 * 1000, // 1 phút
      // });
      return {
        accessToken,
        user: userData,
      };
    } else {
      throw new BadRequestException('Email hoặc mật khẩu không hợp lệ');
    }
  }
  async refresh(req) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new BadRequestException('Không tìm thấy refresh token');
    }
    const user = await this.userModel.findOne({ refreshToken });
    if (!user) {
      throw new BadRequestException('Refresh token không hợp lệ');
    }
    const accessToken = generateAccessToken(
      user._id as unknown as string,
      user.role,
      user.email,
    );
    return {
      message: 'Refreshed successfully',
      accessToken,
    };
  }
  async logout(req, res) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new BadRequestException('Không tìm thấy refresh token');
    }
    const user = await this.userModel.findOne({ refreshToken });
    if (!user) {
      throw new BadRequestException('Refresh token không hợp lệ');
    }
    await this.userModel.findOneAndUpdate(
      { refreshToken: refreshToken },
      { refreshToken: '' },
      { new: true },
    );
    res.clearCookie('refreshToken', { maxAge: 0 });
    return {
      message: 'Logged out successfully',
    };
  }
}
