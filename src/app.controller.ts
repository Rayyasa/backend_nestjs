import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('Belajar-Route')
  getHello2():number {
    return this.appService.getHello2();
  }
  @Get('List')
  belajarRouting(){
    return 'Belajar Routing';
  }

  @Post('create')
  create(){
    return 'belajar Routing dengan method post';
  }
}
