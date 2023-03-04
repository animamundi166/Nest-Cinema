import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ValidateMongoIdPipe } from 'src/pipes/IdValidation.pipe';
import { GenreIdsDto } from './dto/genreIds.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.movieService.bySlug(slug);
  }

  @Get('by-actor/:actorId')
  byActor(@Param('actorId', ValidateMongoIdPipe) actorId: Types.ObjectId) {
    return this.movieService.byActor(actorId);
  }

  @Post('by-genres')
  @HttpCode(200)
  byGenres(
    @Body()
    { genreIds }: GenreIdsDto
  ) {
    return this.movieService.byGenres(genreIds);
  }

  @Get()
  getAll(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.getAll(searchTerm);
  }

  @Get('most-popular')
  getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @Get(':id')
  @Auth('admin')
  getById(@Param('id') id: string) {
    return this.movieService.byId(id);
  }

  @Post()
  @Auth('admin')
  create() {
    return this.movieService.create();
  }

  @Put(':id')
  @Auth('admin')
  update(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() dto: UpdateMovieDto
  ) {
    return this.movieService.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  delete(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.movieService.delete(id);
  }
}
