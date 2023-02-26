import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MovieService } from 'src/movie/movie.service';
import { RatingDto } from './dto/rating.dto';
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

  async averageRatingByMovie(movieId: Types.ObjectId) {
    const ratingMovie = await this.ratingModel.aggregate([
      { $match: { movieId } },
      {
        $group: {
          _id: '$movieId',
          averageQty: { $avg: '$value' },
        },
      },
    ]);

    return ratingMovie[0].averageQty;
  }

  async setRating(userId: Types.ObjectId, dto: RatingDto) {
    const { movieId, value } = dto;

    const newRating = await this.ratingModel.findOneAndUpdate(
      { movieId, userId },
      { movieId, value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const averageRating = await this.averageRatingByMovie(movieId);
    await this.movieService.updateRating(movieId, averageRating);

    return newRating;
  }
}
