import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre, GenreDocument } from './genre.schema';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>
  ) {}

  async byId(_id: string) {
    const genre = await this.genreModel.findById(_id);
    if (!genre) {
      throw new NotFoundException('Genre is not found');
    }
    return genre;
  }

  async create() {
    const defaultValue = {
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
    const slugFounded = await this.genreModel.findOne({ slug });
    if (!slugFounded) {
      throw new NotFoundException('Slug is not found');
    }
    return slugFounded;
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

  async updateGenre(_id: string, dto: CreateGenreDto) {
    const updated = await this.genreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('Genre is not found');
    }
    return updated;
  }

  async deleteGenre(id: string) {
    const deleted = await this.genreModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Genre is not found');
    }
    return deleted;
  }
}
