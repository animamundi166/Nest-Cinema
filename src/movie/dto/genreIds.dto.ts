import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class GenreIdsDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  genreIds: Types.ObjectId[];
}
