import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true, maxlength: 120 })
  content: string; // keep short

  @Prop()
  expireAt?: Date; // TTL - e.g. 24h
}
export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
