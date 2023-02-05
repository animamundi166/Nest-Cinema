import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre, GenreDocument } from './genre.schema';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly genreModel: Model<GenreDocument>
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

  async getCollections() {
    const genres = await this.getAll();
    const collections = genres;
    return collections;
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
