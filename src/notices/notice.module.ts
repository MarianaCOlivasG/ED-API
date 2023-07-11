import { Module } from '@nestjs/common';
import { NoticesService } from './notice.service';
import { NoticesController } from './notice.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Notices, NoticesSchema } from './entities/new.entity';

@Module({
  controllers: [NoticesController],
  providers: [NoticesService],
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      {
        name: Notices.name,
        schema: NoticesSchema
      }
    ]),
  ]
})
export class NoticesModule {}
