import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Model, Types } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { generateAccessToken, generateRefreshToken, verifyToken } from 'src/middlewares/jwt';
import { Response } from 'express';
import { SessionsService } from 'src/session/session.service';
import { SessionGateway } from 'src/session/session.gateway';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly MAX_SESSIONS = Number(process.env.MAX_SESSIONS || 1);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly sessionGateway: SessionGateway, // Use actual type if available
  ) { }
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
  async login(loginDto: LoginDto, req: any, res: any) {
    const { email, password, socketId, userAgent } = loginDto as any;

    const user: UserDocument | null = await this.userModel.findOne({ email });
    if (!(user && (await user.isCorrectPassword(password)))) {
      throw new BadRequestException('Email hoặc mật khẩu không hợp lệ');
    }

    // get IP
    const ip =
      (req.headers && (req.headers['x-forwarded-for'] as string))?.split(',')[0].trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      'unknown';

    const deviceType =
      loginDto.deviceType ||
      (userAgent && /Mobi|Android/i.test(userAgent) ? 'mobile' : 'desktop');

    // Thu hồi các phiên cũ trước
    const revokeResult = await this.sessionsService.revokeByUserAndDevice(user?._id?.toString() as any, deviceType);
    if (revokeResult?.modifiedCount > 0) {
      const oldSessions = await this.sessionsService.listActiveSessionsByDevice(user?._id?.toString() as any, deviceType);
      console.log(oldSessions);
      oldSessions.forEach((oldSession) => {
        if (oldSession.socketId) {
          this.sessionGateway.forceLogout(oldSession.socketId, "Bạn đã bị đăng xuất do đăng nhập ở thiết bị khác.");
        }
      });
    }

    // create new session
    const sessionDoc = await this.sessionsService.createSession({
      userId: user._id as Types.ObjectId,
      ip,
      deviceType,
      userAgent,
      socketId,
    });
    if (sessionDoc.socketId) {
      this.sessionGateway.server.to(sessionDoc.socketId).emit('register_session', sessionDoc?._id?.toString());
    }
    // sign tokens with session id (sid)
    const sid = sessionDoc?._id?.toString();
    const accessToken = generateAccessToken(
      user?._id?.toString() as any,
      user.role,
      user.email,
      sid as string,
    );
    const refreshToken = generateRefreshToken(
      user?._id?.toString() as any,
      user.role,
      user.email,
      sid as string,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    // update refreshToken field on user
    await this.userModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

    const { password: pwd, ...userData } = user.toObject();

    return {
      accessToken,
      refreshToken,
      user: userData,
      sessionId: sid,
    };
  }
  async refresh(req) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new BadRequestException('Không tìm thấy refresh token');
    }

    let payload: any;
    try {
      payload = verifyToken(refreshToken);
    } catch {
      throw new BadRequestException('Refresh token không hợp lệ');
    }

    const session = await this.sessionsService.findById(payload.sid);
    if (!session || session.revoked) {
      throw new BadRequestException('Session revoked or not found');
    }
    console.log(payload, "payload code");
    const accessToken = generateAccessToken(payload.uid, payload.roles?.[0], payload.email, payload.sid);

    return {
      message: 'Refreshed successfully',
      accessToken,
    };
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies;
    console.log(refreshToken, "refreshToken logout");
    if (!refreshToken) {
      throw new BadRequestException('Không tìm thấy refresh token');
    }
    let payload: any;
    try {
      payload = verifyToken(refreshToken);
    } catch {
      throw new BadRequestException('Refresh token không hợp lệ');
    }

    // Xóa session trong DB
    console.log(payload, "payload logout");
    if (payload.sid) {
      await Promise.all([
        this.sessionsService.revokeById(payload.sid),
        this.sessionsService.removeById(payload.sid),
        this.userModel.findByIdAndUpdate(payload.uid, { refreshToken: '' }),
      ]);
    }
    // Clear cookie
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: true });

    return { message: 'Logged out successfully' };

  }
}
