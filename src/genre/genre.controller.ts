import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Delete,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ValidateMongoIdPipe } from 'src/pipes/IdValidation.pipe';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('by-slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.genreService.bySlug(slug);
  }

  @Get('/collections')
  getCollections() {
    return this.genreService.getCollections();
  }

  @Get()
  getAll(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  getById(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.genreService.byId(id);
  }

  @Post()
  @Auth('admin')
  create() {
    return this.genreService.create();
  }

  @Put(':id')
  @Auth('admin')
  update(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() dto: CreateGenreDto
  ) {
    return this.genreService.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  delete(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.genreService.delete(id);
  }
}
