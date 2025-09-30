import { Module } from '@nestjs/common';
import { SessionsService } from './session.service';
import { SessionController } from './session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './entities/session.entity';
import { SessionGateway } from './session.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [SessionController],
  providers: [SessionsService, SessionGateway],
  exports: [SessionsService, SessionGateway],
})
export class SessionModule { }
