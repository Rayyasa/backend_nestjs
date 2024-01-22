import { Module } from '@nestjs/common';
import { KategoriController } from './kategori.controller';
import { KategoriService } from './kategori.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kategori } from './kategori.entity';
import { User } from '../auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kategori,User])],
  controllers: [KategoriController],
  providers: [KategoriService]
})
export class KategoriModule {}
