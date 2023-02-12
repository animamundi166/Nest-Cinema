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
import { ActorService } from './actor.service';
import { ActorDto } from './dto/actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.actorService.bySlug(slug);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.actorService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.actorService.byId(id);
  }

  @Post()
  @Auth('admin')
  async createGenre() {
    return this.actorService.create();
  }

  @Put(':id')
  @Auth('admin')
  async updateGenre(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() dto: ActorDto
  ) {
    return this.actorService.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  async deleteGenre(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.actorService.delete(id);
  }
}
