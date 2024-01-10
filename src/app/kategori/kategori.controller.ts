<<<<<<< HEAD
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { CreateKategoriDto, findAllKategori } from './kategori.dto';
import { JwtGuard } from '../auth/auth.guard';
=======
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { KategoriService } from './kategori.service';
import { CreateKategoriArrayDto, CreateKategoriDto, FindAllKategori, UpdateKategoriDto } from './kategori.dto';
>>>>>>> 76fee98 (bab kategori kelar)
import { Pagination } from 'src/utils/decorator/pagination.decorator';


@UseGuards(JwtGuard) //  implementasikan global guard pada semua endpont kategori memerlukan authentikasi saat request
@Controller('kategori')
export class KategoriController {
<<<<<<< HEAD
  constructor(private kategoriService: KategoriService) {}
=======
  constructor(private kategoriService: KategoriService) { }

>>>>>>> 76fee98 (bab kategori kelar)

  @Post('create')
  async create(@Body() payload: CreateKategoriDto) {
    return this.kategoriService.create(payload);
  }
<<<<<<< HEAD
=======
  @Put('update/:id')
  async update(@Param('id') id: string, @InjectUpdatedBy() payload: UpdateKategoriDto) {
    return this.kategoriService.updateKategori(payload, Number(id));
  }
>>>>>>> 76fee98 (bab kategori kelar)

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {  //gunakan custom decorator yang pernah kita buat
    return this.kategoriService.getAllCategory(query);
  }
<<<<<<< HEAD
}
=======

  @Get('detail/:id')
  findOneKategori(@Param('id') id: string) {
    return this.kategoriService.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.kategoriService.deleteKategori(+id);
  }
  @Post('/create/bulk')
  bulkCreateBook(@Body() payload: CreateKategoriArrayDto) {
    return this.kategoriService.bulkCreate(payload);
  }
}
>>>>>>> 76fee98 (bab kategori kelar)
