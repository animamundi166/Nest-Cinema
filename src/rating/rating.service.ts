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

  async averageMovieByMovie(movieId: Types.ObjectId) {
    const ratingMovie = await this.ratingModel.aggregate([
      { $match: { movieId } },
    ]);

    console.log(ratingMovie);

    const accRatingMovie = ratingMovie.reduce(
      (acc, item) => acc + item.value,
      0
    );
    const avgRatingMovie = accRatingMovie / ratingMovie.length;
    return avgRatingMovie;
  }

  async setRating(userId: Types.ObjectId, dto: RatingDto) {
    const { movieId, value } = dto;

    const newRating = await this.ratingModel.findOneAndUpdate(
      { movieId, userId },
      { movieId, userId, value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const avegageRating = await this.averageMovieByMovie(movieId);
    await this.movieService.updateRating(movieId, avegageRating);

    return newRating;
  }
}
