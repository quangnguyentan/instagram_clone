import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { generateAccessToken, generateRefreshToken } from 'src/middlewares/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterDto) {
    const { username, email, password, ...userData } = registerAuthDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const user = await this.userModel.create({
      ...userData,
      username,
      email,
      password,
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
      return {
        accessToken,
        user: userData,
      };
    } else {
      throw new BadRequestException('Invalid email or password');
    }
  }
  async refresh(req) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new BadRequestException('No refresh token found');
    }
    const user = await this.userModel.findOne({ refreshToken });
    if (!user) {
      throw new BadRequestException('Invalid refresh token');
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
      throw new BadRequestException('No refresh token found');
    }
    const user = await this.userModel.findOne({ refreshToken });
    if (!user) {
      throw new BadRequestException('Invalid refresh token');
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
