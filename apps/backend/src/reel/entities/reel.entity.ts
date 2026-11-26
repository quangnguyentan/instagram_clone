import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Reel extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  caption?: string;

  @Prop({ type: [String], default: [] })
  mediaUrls: string[];

  @Prop({ type: [String], default: [] })
  mediaPublicIds: string[];

  @Prop({ type: String, enum: ['image', 'video'], default: 'video' })
  mediaType: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }], default: [] })
  tags: Types.ObjectId[];
}

export const ReelSchema = SchemaFactory.createForClass(Reel);
ReelSchema.index({ createdAt: -1 });
