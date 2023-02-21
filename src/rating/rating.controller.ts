import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ValidateMongoIdPipe } from 'src/pipes/IdValidation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { RatingDto } from './dto/rating.dto';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/:movieId')
  @Auth()
  async getMovieValueByUser(
    @Param('movieId', ValidateMongoIdPipe) movieId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId
  ) {
    return this.ratingService.getMovieValueByUser(movieId, userId);
  }

  @Post('set-rating')
  @HttpCode(200)
  @Auth()
  async setRating(@User('_id') userId: Types.ObjectId, @Body() dto: RatingDto) {
    return this.ratingService.setRating(userId, dto);
  }
}
