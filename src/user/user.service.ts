import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async byId(_id: string) {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException('User not found');
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
    const count = this.userModel.find().count();
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
      .select('-password, -updatedAt, -__v')
      .sort({
        createdAt: 'desc',
      })
      .exec();
  }

  async deleteUser(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    return deleted;
  }
}
