import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MovieService } from 'src/movie/movie.service';
import { Rating, RatingDocument } from './rating.schema';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name)
    private readonly ratingModel: Model<RatingDocument>,
    private readonly movieService: MovieService
  ) {}

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    const doc = await this.ratingModel
      .findOne({ movieId, userId })
      .select('value')
      .then((data) => (data ? data.value : 0));

    return doc;
  }
}
