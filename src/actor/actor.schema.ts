import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActorDocument = HydratedDocument<Actor>;

@Schema()
export class Actor {
  @Prop()
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop()
  photo: string;
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
