import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ValidateMongoIdPipe } from 'src/pipes/IdValidation.pipe';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.genreService.bySlug(slug);
  }

  @Get('/collections')
  async getCollections() {
    return this.genreService.getCollections();
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.genreService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @Auth('admin')
  async createGenre() {
    return this.genreService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth('admin')
  async updateGenre(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() dto: CreateGenreDto
  ) {
    return this.genreService.updateGenre(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  async deleteGenre(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.genreService.deleteGenre(id);
  }
}
