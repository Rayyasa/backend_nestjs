import { Module } from '@nestjs/common';
import { UtsService } from './uts.service';
import { UtsController } from './uts.controller';
import { PembelianMobil } from './uts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PembelianMobil])],
  providers: [UtsService],
  controllers: [UtsController]
})
export class UtsModule {}
