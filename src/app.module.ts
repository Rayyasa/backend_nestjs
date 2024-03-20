import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { KategoriModule } from './app/kategori/kategori.module';
import { ProdukModule } from './app/produk/produk.module';
import { UploadController } from './app/upload/upload.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { KonsumenModule } from './app/konsumen/konsumen.module';
import { UniqueValidator } from './utils/validator/unique.validator';
import { ProfileModule } from './app/profile/profile.module';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }), TypeOrmModule.forRoot(typeOrmConfig), LatihanModule, BookModule, AuthModule, MailModule, KategoriModule, ProdukModule, KonsumenModule, ProfileModule],
  controllers: [AppController, UploadController],
  providers: [AppService, UniqueValidator],
})
export class AppModule { }
