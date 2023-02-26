import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieService } from 'src/movie/movie.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { ICollection } from './genre.interface';
import { Genre, GenreDocument } from './genre.schema';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly genreModel: Model<GenreDocument>,
    private readonly movieService: MovieService
  ) {}

  async byId(_id: string) {
    const doc = await this.genreModel.findById(_id);
    if (!doc) {
      throw new NotFoundException('Genre is not found');
    }
    return doc;
  }

  async create() {
    const defaultValue: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    };
    const genre = await this.genreModel.create(defaultValue);
    return genre._id;
  }

  async bySlug(slug: string) {
    const doc = await this.genreModel.findOne({ slug });
    if (!doc) {
      throw new NotFoundException('Slug is not found');
    }
    return doc;
  }

  async getAll(searchTerm?: string) {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.genreModel.find(options).select('-updatedAt -__v').sort({
      createdAt: 'desc',
    });
  }

  async getCollections() {
    const genres = await this.getAll();

    const collections: ICollection[] = await Promise.all(
      genres.map(async (genre) => {
        const moviesByGenre = await this.movieService.byGenres([genre._id]);

        const result: ICollection = {
          _id: String(genre._id),
          title: genre.name,
          slug: genre.slug,
          image: moviesByGenre[0].bigPoster,
        };

        return result;
      })
    );

    return collections;
  }

  async update(_id: string, dto: CreateGenreDto) {
    const doc = await this.genreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });
    if (!doc) {
      throw new NotFoundException('Genre is not found');
    }
    return doc;
  }

  async delete(id: string) {
    const doc = await this.genreModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundException('Genre is not found');
    }
    return doc;
  }
}
