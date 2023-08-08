import { Controller, Get, Param, Post, Put, Patch, Delete, Body, Query } from '@nestjs/common';
import { query } from 'express';
import { LatihanService } from './latihan.service';

interface payloadDto {
  name: string;
  sekolah:string;
}


interface QueryLatihanDto {
  name?:string;
  age_start?:number;
  age_end?:number;
}
@Controller('latihan')
export class LatihanController {
 constructor (private latihanService: LatihanService){}

  @Get('/list')
  getLatihan() {
    return this.latihanService.getLatihan();
  }

  @Get('/halo')
  getHello() {
    return this.latihanService.hello();
  }

  @Post('/test')
  getAge() {
    return this.latihanService.getAge();
  }

  @Post()
  create(@Body() payload:any){
    console.log('payload',payload);
    return this.latihanService.hello();
  }
  

  @Post('create')
  create2(@Body() payload:payloadDto){
    const {name, sekolah} = payload;
    return {
      method: "POST",
      name,
    sekolah,
  };
}

@Put('update/:id/:nama')
update(@Param('id') id:string, @Body() payload:payloadDto, @Param('nama') nama:string) {
  return {
    id:id,
    nama:nama,
      payload:payload,
    };
  }
  
 @Patch() 
 patch() {
   return `latihan menggunakan method Patch`;
  }
  
  @Delete('delete/:id')
  hapus(@Param('id') id:string) {
    return {
      Method: "Delete",
      id,
    };
  }
  
  @Get()
  findAll(@Query() query:any) {
    return {
      method: 'GET',
      query,
    };
  }
  @Get('info/:id/:username/:age')
  findById(@Param('id') id:string, @Param('username') username:string, @Param('age') age:number) {
    return {
      method: 'GET',
      Param: {
        id:id,
        username,
        age,
      },
    };
  } 
  //   @Get()
  //  findAll() {
  //   return `latihan menggunakan method GET`;
  //  }
}
