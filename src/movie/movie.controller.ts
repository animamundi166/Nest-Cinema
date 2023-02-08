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
import { ObjectId } from 'mongoose';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ValidateMongoIdPipe } from 'src/pipes/IdValidation.pipe';
import { genreIdsDto } from './dto/genreIds.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.movieService.bySlug(slug);
  }

  @Get('by-actor/:actorId')
  async byActor(@Param('actorId', ValidateMongoIdPipe) actorId: ObjectId) {
    return this.movieService.byActor(actorId);
  }

  @Post('by-genres')
  @HttpCode(200)
  async byGenres(@Body() genreIds: genreIdsDto) {
    return this.movieService.byGenres(genreIds);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.getAll(searchTerm);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.movieService.byId(id);
  }

  @Post()
  @Auth('admin')
  async create() {
    return this.movieService.create();
  }

  @Put(':id')
  @Auth('admin')
  async update(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() dto: UpdateMovieDto
  ) {
    return this.movieService.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.movieService.delete(id);
  }
}
