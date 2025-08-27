import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Story extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  mediaUrl: string;

  @Prop({ type: String, enum: ['image', 'video'], default: 'image' })
  mediaType: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  viewers: Types.ObjectId[];

  // expireAt will be used with a TTL index to auto-delete after 24h
  @Prop()
  expireAt?: Date;
}

export const StorySchema = SchemaFactory.createForClass(Story);
StorySchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
