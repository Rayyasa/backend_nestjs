import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { KategoriService } from './kategori.service';
import { CreateKategoriArrayDto, CreateKategoriDto, findAllKategori, UpdateKategoriDto } from './kategori.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-cretaed_by.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';


@UseGuards(JwtGuard)
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) { }


  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKategoriDto) {
    return this.kategoriService.create(payload);
  }
  @Put('update/:id')
  async update(@Param('id') id: string, @InjectUpdatedBy() payload: UpdateKategoriDto) {
    return this.kategoriService.updateKategori(payload, Number(id));
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    return this.kategoriService.getAllCategory(query);
  }

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
