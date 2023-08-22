import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator/types/container';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist : true}));
  // useContainer(app.select(AppModule),{fallbackOnErrors: true});
  await app.listen(5002);
}
bootstrap();
