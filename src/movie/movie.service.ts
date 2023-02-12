import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, MovieDocument } from './movie.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>
  ) {}

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.movieModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .populate('genres actors');
  }

  async bySlug(slug: string) {
    const doc = await this.movieModel
      .findOneAndUpdate({ slug }, { $inc: { countOfViews: 1 } }, { new: true })
      .populate('genres actors');

    if (!doc) {
      throw new NotFoundException('Movie is not found');
    }

    return doc;
  }

  async byActor(actorId: Types.ObjectId) {
    const doc = await this.movieModel.find({ actors: actorId });

    if (!doc) {
      throw new NotFoundException('Movie is not found');
    }

    return doc;
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    const doc = await this.movieModel.find({
      genres: { $in: genreIds },
    });

    if (!doc) {
      throw new NotFoundException('Movie is not found');
    }

    return doc;
  }

  async getMostPopular() {
    const doc = await this.movieModel
      .find({ countOfViews: { $gt: 0 } })
      .sort({ countOfViews: -1 })
      .populate('genres');

    return doc;
  }

  async byId(id: string) {
    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie is not found');
    }
    return movie;
  }

  async create() {
    const defaultValue: UpdateMovieDto = {
      poster: '',
      bigPoster: '',
      title: '',
      slug: '',
      videoUrl: '',
      genres: [],
      actors: [],
    };
    const movie = await this.movieModel.create(defaultValue);
    return movie._id;
  }

  async update(_id: string, dto: UpdateMovieDto) {
    const doc = await this.movieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });

    if (!doc) {
      throw new NotFoundException('Movie is not found');
    }

    return doc;
  }

  async delete(id: string) {
    const doc = await this.movieModel.findByIdAndDelete(id);

    if (!doc) {
      throw new NotFoundException('Movie is not found');
    }

    return doc;
  }
}
