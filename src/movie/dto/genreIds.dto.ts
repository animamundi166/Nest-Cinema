import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';

export class genreIdsDto {
  @IsMongoId({ each: true })
  genreIds: ObjectId[];
}
