import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Movie' }] })
  favourites?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
