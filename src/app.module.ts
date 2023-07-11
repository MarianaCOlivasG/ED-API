import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule }  from '@nestjs/config'
import { EnvCongifuration } from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { NoticesModule } from './notices/notice.module';
import { NewsModule } from './news/new.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvCongifuration ],
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    AuthModule,
    NoticesModule,
    NewsModule
  ],
  controllers: [

  ],
  providers: [ 
    
  ],
})
export class AppModule {}
