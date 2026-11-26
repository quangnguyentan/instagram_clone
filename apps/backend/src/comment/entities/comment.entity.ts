import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Reel' })
  reel?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parent?: Types.ObjectId | null; // reply

  @Prop({ required: true })
  content: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ reel: 1, createdAt: -1 });
