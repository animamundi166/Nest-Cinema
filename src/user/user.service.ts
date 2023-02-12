import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async byId(_id: string) {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }

  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.byId(_id);
    const isSameUser = await this.userModel.findOne({ email: dto.email });

    if (isSameUser && _id !== String(isSameUser._id)) {
      throw new NotFoundException('email is busy');
    }

    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }

    user.email = dto.email;
    if (dto.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin;
    }

    await user.save();
  }

  async getCount() {
    const count = await this.userModel.countDocuments();
    return count;
  }

  async getAll(searchTerm?: string) {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.userModel
      .find(options)
      .select('-password -updatedAt -__v')
      .sort({
        createdAt: 'desc',
      });
  }

  async deleteUser(id: string) {
    await this.userModel.findByIdAndDelete(id);
  }

  async getFavouriteMovies(_id: Types.ObjectId) {
    const doc = await this.userModel
      .findById(_id, 'favourites')
      .populate({
        path: 'favourites',
        populate: {
          path: 'genres',
        },
      })
      .then((data) => data.favourites);

    return doc;
  }

  async toggleFavourite(movieId: Types.ObjectId, user: UserDocument) {
    const { _id, favourites } = user;

    const doc = await this.userModel.findByIdAndUpdate(_id, {
      favourites: favourites.includes(movieId)
        ? favourites.filter((id) => String(id) !== String(movieId))
        : [...favourites, movieId],
    });

    return doc;
  }
}
