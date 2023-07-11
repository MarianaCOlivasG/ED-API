import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
   );


  await app.listen( 
    process.env.PORT, 
    process.env.HOST_SERVER, () => {
    console.log('Server is running on',  'HOST: ' + process.env.HOST_SERVER, 'PORT: ' + process.env.PORT)
  });


}
bootstrap();
