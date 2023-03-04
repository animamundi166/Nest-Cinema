import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ValidateMongoIdPipe } from 'src/pipes/IdValidation.pipe';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  getProfile(@User('_id') _id: string) {
    return this.userService.byId(_id);
  }

  @Get('count')
  @Auth('admin')
  getCountUsers() {
    return this.userService.getCount();
  }

  @Get(':id')
  @Auth('admin')
  getUser(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.userService.byId(id);
  }

  @Get()
  @Auth('admin')
  getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAll(searchTerm);
  }

  @Put('profile')
  @Auth()
  updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto);
  }

  @Put(':id')
  @Auth('admin')
  updateUser(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  deleteUser(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('profile/favourites')
  @Auth()
  getFavourites(@User('_id') _id: Types.ObjectId) {
    return this.userService.getFavouriteMovies(_id);
  }

  @Post('profile/favourites')
  @HttpCode(200)
  @Auth()
  toggleFavourite(
    @Body('movieId', ValidateMongoIdPipe) movieId: Types.ObjectId,
    @User() user: UserDocument
  ) {
    return this.userService.toggleFavourite(movieId, user);
  }
}
