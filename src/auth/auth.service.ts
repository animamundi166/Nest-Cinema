import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(dto: AuthDto) {
    const oldUser = await this.userModel.findOne({ email: dto.email });
    if (oldUser) {
      throw new BadRequestException('User is exists');
    }
    const newUser = new this.userModel(dto);
    return newUser.save();
  }
}
