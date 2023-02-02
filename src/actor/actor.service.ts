import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Actor, ActorDocument } from './actor.schema';
import { ActorDto } from './dto/actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name) private actorModel: Model<ActorDocument>
  ) {}

  async bySlug(slug: string) {
    const slugFounded = await this.actorModel.findOne({ slug });
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
        ],
      };
    }

    return this.actorModel.find(options).select('-updatedAt -__v').sort({
      createdAt: 'desc',
    });
  }

  async byId(_id: string) {
    const actor = await this.actorModel.findById(_id);
    if (!actor) {
      throw new NotFoundException('Actor is not found');
    }
    return actor;
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
    const updated = await this.actorModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('Actor is not found');
    }
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.actorModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Actor is not found');
    }
    return deleted;
  }
}
