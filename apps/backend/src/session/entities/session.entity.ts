import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
    @Prop({ required: true, type: Types.ObjectId }) userId: Types.ObjectId;

    @Prop({ required: true })
    ip: string;

    @Prop({ required: true })
    deviceType: string; // 'mobile' | 'desktop' | 'tablet' | custom

    @Prop() userAgent?: string;

    @Prop() socketId?: string;

    @Prop({ default: false }) revoked: boolean;

    @Prop({ default: Date.now }) lastActive: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
