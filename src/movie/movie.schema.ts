import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Actor } from 'src/actor/actor.schema';
import { Genre } from 'src/genre/genre.schema';

export type MovieDocument = HydratedDocument<Movie>;

class Parameters {
  @Prop()
  year: number;

  @Prop()
  duration: number;

  @Prop()
  country: string;
}

@Schema()
export class Movie {
  @Prop()
  poster: string;

  @Prop()
  bigPoster: string;

  @Prop()
  title: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ default: 0 })
  rating?: number;

  @Prop({ default: 0 })
  countOfViews?: number;

  @Prop()
  videoUrl: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Genre' }] })
  genres: Genre[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Actor' }] })
  actors: Actor[];

  @Prop()
  parameters?: Parameters;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
