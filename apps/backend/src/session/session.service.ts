import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from './entities/session.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private eventEmitter: EventEmitter2, // Inject EventEmitter2
  ) { }

  async createSession(payload: {
    userId: Types.ObjectId | string;
    ip: string;
    deviceType: string;
    userAgent?: string;
    socketId?: string;
  }) {
    console.log("Creating session with payload:", payload);
    const doc = await this.sessionModel.create({
      ...payload,
      lastActive: new Date(),
      revoked: false,
    });
    console.log("Session created:", doc);

    // Phát sự kiện khi session được tạo
    this.eventEmitter.emit('session.created', doc);
    return doc;
  }

  async revokeByUserAndDevice(userId: string, deviceType: string) {
    const result = await this.sessionModel.updateMany(
      { userId: new Types.ObjectId(userId), deviceType, revoked: false },
      { $set: { revoked: true }, $currentDate: { lastActive: true } }
    );
    if (result.modifiedCount > 0) {
      // Lấy danh sách session bị thu hồi để emit sự kiện
      const revokedSessions = await this.sessionModel.find({
        userId: new Types.ObjectId(userId),
        deviceType,
        revoked: true,
      }).lean();
      revokedSessions.forEach(session => {
        this.eventEmitter.emit('session.revoked', session);
      });
    }
    return result;
  }

  async findById(id: string) {
    return this.sessionModel.findById(id).exec();
  }

  async listActiveSessions(userId: string) {
    return this.sessionModel.find({ userId, revoked: false }).sort({ createdAt: 1 }).lean().exec();
  }

  async listActiveSessionsByDevice(userId: string, deviceType: string) {
    const response = await this.sessionModel.find({ userId, deviceType, revoked: false }).sort({ createdAt: 1 }).lean().exec();
    console.log(response);
    return response;
  }

  async revokeByIds(ids: (string | Types.ObjectId)[]) {
    const result = await this.sessionModel.updateMany({ _id: { $in: ids } }, { revoked: true }).exec();
    if (result.modifiedCount > 0) {
      const revokedSessions = await this.sessionModel.find({ _id: { $in: ids } }).lean();
      revokedSessions.forEach(session => {
        this.eventEmitter.emit('session.revoked', session);
      });
    }
    return result;
  }

  async revokeById(id: string) {
    const session = await this.sessionModel.findByIdAndUpdate(id, { revoked: true }).exec();
    if (session) {
      this.eventEmitter.emit('session.revoked', session);
    }
    return session;
  }

  async touchLastActive(id: string) {
    return this.sessionModel.findByIdAndUpdate(id, { lastActive: new Date() }).exec();
  }

  async removeOldSessions(days: number) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.sessionModel.deleteMany({ createdAt: { $lt: cutoff } }).exec();
  }

  async removeById(id: string) {
    const session = await this.sessionModel.findByIdAndDelete(id).exec();
    if (session) {
      this.eventEmitter.emit('session.revoked', session); // Gửi sự kiện khi xóa
    }
    return session;
  }
}