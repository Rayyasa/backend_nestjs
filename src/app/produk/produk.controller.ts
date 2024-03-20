import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukArrayDto, CreateProdukDto, DeleteArrayDto, UpdateProdukDto, findAllProduk } from './produk.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@UseGuards(JwtGuard)
@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) { }

  @Post('create-bulk')
  async createBulk(@Body() payload: CreateProdukArrayDto) {
    return this.produkService.createBulk(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: findAllProduk) {
    return this.produkService.findAll(query);
  }

  @Post('create')
  async create(@Body() payload: CreateProdukDto) {
    return this.produkService.create(payload);
  }

  @Get('detail/:id')
  async findOneProduk(@Param('id') id: string) {
    return this.produkService.getDetail(Number(id));
  }

  @Put('update/:id')
  async update(@Param('id') id: number, @Body() payload: UpdateProdukDto) {
    return this.produkService.update(payload, Number(id));
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.produkService.delete(Number(id));
  }

  @Post('/delete-bulk')
  async bulkDelete(@Body() payload: DeleteArrayDto) {
    return this.produkService.bulkDelete(payload);
  }
}