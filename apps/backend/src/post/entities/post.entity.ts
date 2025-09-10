// post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  caption?: string;

  @Prop([
    {
      url: String,
      public_id: String,
    },
  ])
  media: { url: string; public_id: string }[];

  @Prop({ type: String, enum: ['image', 'video'], default: 'image' })
  mediaType: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }], default: [] })
  tags: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ createdAt: -1 });
PostSchema.plugin(mongoosePaginate);

// Định nghĩa interface để TypeScript hiểu paginate
export interface PostDocument extends Post, Document {}
