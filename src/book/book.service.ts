import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ResponseSuccess } from './interface';
import { createBookDto } from './book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
@Injectable()
export class BookService {

  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) { }


  private books: {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] = [
      {
        id: 1,
        title: "Programming Book",
        author: "Rayya Disayidan",
        year: 2023,
      },
      {
        id: 2,
        title: "HTML CSS JavaScript Book",
        author: "Rayya Disayidan",
        year: 2023,
      },
      {
        id: 3,
        title: "Geographic Book",
        author: "Rayya Disayidan",
        year: 2023,
      },
    ];

  async getAllBooks(): Promise<ResponseSuccess> {
    const book = await this.bookRepository.find();
    return {
      status: 'Success',
      message: 'Buku Founded!',
      data: book,
    }
  }

  // createBook(
  //   title: string,
  //   author: string,
  //   year: number,
  // ): {
  //   status: string;
  //   message: string;
  // } {
  //   this.books.push({
  //     id: new Date().getTime(),
  //     title: title,
  //     author: author,
  //     year: year,
  //   });

  //   return {
  //     status: 'Success',
  //     message: 'Berhasil menambakan buku',
  //   };
  // }
  async createBook(createBookDto: createBookDto): Promise<ResponseSuccess> {
    const { title, author, year } = createBookDto;

    try {
      await this.bookRepository.save({
        title: title,
        author: author,
        year: year,
      });
      return {
        status: 'Oke',
        message: 'Berhasil menambahkan buku',
      }
    } catch (err) {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST)
    }
  }






  // async createBook(createBookDto:createBookDto): Promise<ResponseSuccess> {

  //   const {title, author, year} = createBookDto;

  //   try {
  //     await this.bookRepository.save({
  //       title:title,
  //       author:author,
  //       year:year,
  //     });
  //     return {
  //       status:'Success',
  //       message: 'Berhasil menambahkan buku',
  //     };
  //   } catch (err) {
  //     throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST);
  //   }
  // }

  private findBookById(id: number): number {
    //Mencari Index berdasarkan id
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }
    return bookIndex;
  }
 async getDetail(id: number): Promise <ResponseSuccess>{
    const bookIndex = this.findBookById(id);
    const detailbook = await this.bookRepository.findOne({
      where: {
        id,
      },
    });
    if(detailbook === null) {
      throw new NotFoundException(`Buku dengan id ${id} tidal ditemukan`)
    }
    return {
      status: 'Success',
      message: 'Data Buku ditemukan!',
      data: detailbook,
    };
  }
  updateBook(
    id: number,
    payload: any,
  ): ResponseSuccess {
    const bookIndex = this.findBookById(id);
    const { title, author, year } = payload;
    this.books[bookIndex].title = title;
    this.books[bookIndex].author = author;
    this.books[bookIndex].year = year;
    return {
      status: 'success',
      message: 'Berhasil update buku',
    }
  }

  deleteBook(id: number): ResponseSuccess {
    const bookIndex = this.findBookById(id);
    this.books.splice(bookIndex, 1);

    return {
      status: `Succes ${bookIndex}`,
      message: 'Berhasil menghapus buku',
    };
  }


  // updateBook(): {status:string; message: string} {
  //   return{
  //     status: 'Oke',
  //     message: 'Berhasil mempebaharui buku'
  //   }
  // }



}
