import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),LatihanModule, BookModule,AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
