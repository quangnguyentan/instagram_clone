import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionsService } from 'src/session/session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly sessionsService: SessionsService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'changeme',
    });
  }

  async validate(payload: any) {
    const sid = payload.sid;
    if (!sid) throw new UnauthorizedException('Invalid token (no session)');
    const session = await this.sessionsService.findById(sid);
    if (!session || session.revoked) {
      throw new UnauthorizedException('Session revoked or not found');
    }
    // touch lastActive
    await this.sessionsService.touchLastActive(sid);
    return { userId: payload.uid, email: payload.email, roles: payload.roles, sessionId: sid };
  }
}
