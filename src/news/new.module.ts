import { Module } from '@nestjs/common';
import { NewService } from './new.service';
import { NewsController } from './new.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './entities/new.entity';

@Module({
  controllers: [NewsController],
  providers: [NewService],
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      {
        name: News.name,
        schema: NewsSchema
      }
    ]),
  ]
})
export class NewsModule {}
