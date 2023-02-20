import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Movie } from 'src/movie/movie.schema';
import { User } from 'src/user/user.schema';

export type RatingDocument = HydratedDocument<Rating>;

@Schema()
export class Rating {
  @Prop({ type: { type: MongooseSchema.Types.ObjectId, ref: 'User' } })
  userId: User;

  @Prop({ type: { type: MongooseSchema.Types.ObjectId, ref: 'Movie' } })
  movieId: Movie;

  @Prop()
  value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
