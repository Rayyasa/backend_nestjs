import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe,Query } from '@nestjs/common';
import { BookService } from './book.service';
import { title } from 'process';
import { DeleteBooksDto, createBookArrayDto, createBookDto, FindBookDto, updateBookDto } from './book.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) { }

  @Get("/list")
  findAllBook(@Pagination() findBookDto:FindBookDto)  {
    console.log(findBookDto);
    return this.bookService.getAllBooks(findBookDto);
  }

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }

  @Put('update/:id')
  updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: updateBookDto
  ) {
    return this.bookService.updateBook(Number(id), updateBookDto)
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }

  @Post('/create')
  @UsePipes(ValidationPipe)
  createBook(@Body() payload: createBookDto) {
    return this.bookService.createBook(payload)
  }

  @Post('/create/bulk')
  bulkCreateBook(@Body() payload: createBookArrayDto) {
    return this.bookService.bulkCreate(payload);
  }

  @Post('/delete/bulk')
  bulkDeleteBook(@Body() payload:DeleteBooksDto) {
    return this.bookService.bulkDelete(payload)
  }


}
