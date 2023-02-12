import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Actor, ActorDocument } from './actor.schema';
import { ActorDto } from './dto/actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name) private readonly actorModel: Model<ActorDocument>
  ) {}

  async bySlug(slug: string) {
    const doc = await this.actorModel.findOne({ slug });
    if (!doc) {
      throw new NotFoundException('Slug is not found');
    }
    return doc;
  }

  // async getAll(searchTerm?: string) {
  //   let options = {};
  //   if (searchTerm) {
  //     options = {
  //       $or: [
  //         {
  //           name: new RegExp(searchTerm, 'i'),
  //         },
  //         {
  //           slug: new RegExp(searchTerm, 'i'),
  //         },
  //       ],
  //     };
  //   }

  //   const pipeline = [
  //     { $match: options },
  //     {
  //       $lookup: {
  //         from: 'Movie',
  //         foreignField: 'actors',
  //         localField: '_id',
  //         as: 'movies',
  //       },
  //     },
  //     {
  //       $addFields: {
  //         countMovies: {
  //           $size: '$movies',
  //         },
  //       },
  //     },
  //     { $project: { __v: 0 } },
  //   ];

  //   const aggregated = this.actorModel.aggregate(pipeline);
  //   return aggregated;
  // }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm)
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
        ],
      };

    return (
      this.actorModel
        .aggregate()
        // .match(options)
        .lookup({
          from: 'Movie',
          localField: '_id',
          foreignField: 'actors',
          as: 'movies',
        })
        .addFields({
          countMovies: {
            $size: '$movies',
          },
        })
        .project({ __v: 0, updatedAt: 0 })
        .sort({
          createdAt: -1,
        })
        .exec()
    );
  }

  async byId(_id: string) {
    const doc = await this.actorModel.findById(_id);
    if (!doc) {
      throw new NotFoundException('Actor is not found');
    }
    return doc;
  }

  async create() {
    const defaultValue: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    };
    const actor = await this.actorModel.create(defaultValue);
    return actor._id;
  }

  async update(_id: string, dto: ActorDto) {
    const doc = await this.actorModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });
    if (!doc) {
      throw new NotFoundException('Actor is not found');
    }
    return doc;
  }

  async delete(id: string) {
    const doc = await this.actorModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundException('Actor is not found');
    }
    return doc;
  }
}
