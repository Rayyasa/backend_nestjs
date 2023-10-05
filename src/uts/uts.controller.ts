import { Controller, Query } from '@nestjs/common';
import { Delete, Get, Param, Post, Put, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { UtsService } from './uts.service';
import { DeleteMobilsDto, FindCarDto, createMobilArrayDto, PembelianMobilDTO,updateMobilDto } from './dto/utsdto';
@Controller('uts')
export class UtsController {
  constructor(private utsService: UtsService) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  createMobil(@Body() mobilDto:PembelianMobilDTO) {
    return this.utsService.createMobil(mobilDto)
  }
  @Put('update/:id')
  updateMobil(@Param('id') id: string, @Body() updateMobilDto: updateMobilDto) {
    return this.utsService.updateMobil(Number(id), updateMobilDto);
  }
  @Get('detail/:id')
  findOneUsers(@Param('id') id: string) {
    return this.utsService.getDetail(Number(id));
  }
  @Get('/list')
  findUsers() {
    return this.utsService.getAll();
  }
  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    await this.utsService.deleteMobil(+id);
  }
  
  @Post('/create/bulk')
  bulkCreatemobil(@Body() payload: createMobilArrayDto) {
    return this.utsService.bulkCreate(payload);
  }
  @Post('/delete/bulk')
  bulkDeletemobil(@Body() payload:DeleteMobilsDto) {
    return this.utsService.bulkDelete(payload)
  }
  @Get("/filter")
  filterCar(@Query() FindMobilDto:FindCarDto)  {
    return this.utsService.filterMobilByCriteria(FindMobilDto);
  }
}
