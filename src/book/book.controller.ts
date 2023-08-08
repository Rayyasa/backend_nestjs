import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { title } from 'process';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService){}

  @Get("/list")
  findAllBook() {
    return this.bookService.getAllBooks();
  }

  @Post('/create')
  createBook(
    @Body('title') title:string,
    @Body('author') author:string,
    @Body('year') year:number,
  ) {
    return this.bookService.createBook(title, author, year);
  }


  @Get('detail/:id')
  findOneBook(@Param('id') id:string) {
    return this.bookService.getDetail(Number(id));
  }


  @Put('update/:id')
  updateBook(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('author') author: string,
    @Body('year') year: number,
  ) {
    return this.bookService.updateBook(Number(id), title, author, year);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id:string) {
    return this.bookService.deleteBook(+id);
  }
}
