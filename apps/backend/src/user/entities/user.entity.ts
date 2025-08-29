import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
export interface IUserMethods {
  isCorrectPassword(password: string): Promise<boolean>;
}
export type UserDocument = User & Document & IUserMethods;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop()
  fullName?: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  bio?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ default: false })
  isVerified: boolean;

  // store arrays of ObjectId refs for easy populate
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  followers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  following: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    if (typeof this.password === 'string') {
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});
UserSchema.methods.isCorrectPassword = async function (password: string) {
  if (!password || !this.password) return false;
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log(error);
    return false;
  }
};
