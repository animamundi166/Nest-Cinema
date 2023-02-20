import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { getMongoConfig } from './config/mongo.config';
import { GenreModule } from './genre/genre.module';
import { FilesModule } from './files/files.module';
import { ActorModule } from './actor/actor.module';
import { MovieModule } from './movie/movie.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    UserModule,
    GenreModule,
    FilesModule,
    ActorModule,
    MovieModule,
    RatingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
