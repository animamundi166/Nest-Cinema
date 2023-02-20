import { IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class RatingDto {
  @IsMongoId()
  movieId: Types.ObjectId;

  @IsNumber()
  value: number;
}
