import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ResponseSuccess } from './interface';
import { createBookArrayDto, createBookDto, updateBookDto } from './book.dto';
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

  // private findBookById(id: number): number {
  //   //Mencari Index berdasarkan id
  //   const bookIndex = this.books.findIndex((book) => book.id === id);

  //   if (bookIndex === -1) {
  //     throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
  //   }
  //   return bookIndex;
  // }


 async getDetail(id: number): Promise <ResponseSuccess>{
    const book = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    console.log(book);

    if(book === null) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`)
    }
    return {
      status: 'Success',
      message: 'Data Buku ditemukan!',
      data: book,
    };
  }


  async updateBook(
    id: number,
    updateBookDto:updateBookDto,
  ):Promise <ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id : id,
      },
    });

    if(!check) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }

    const update = await this.bookRepository.save({...updateBookDto, id:id});
    return {
      status: 'success',
      message: 'Berhasil update buku',
      data: update,
    }
  }

 async deleteBook(id: number):Promise <ResponseSuccess> {
  const check = await this.bookRepository.findOne({
    where: {
      id : id,
    },
  });

  if(!check) {
    throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
  }

  await this.bookRepository.delete(id)

    return {
      status: `Succes`,
      message: 'Berhasil menghapus buku',
    };
  }

  private _success(message: string, data?: any): ResponseSuccess {
    return {
      status: 'Success',
      message: message,
      data: data,
    };
  }

  async bulkCreate(payload: createBookArrayDto) : Promise <ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (data) => {
          try {
            await this.bookRepository.save(data);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      ); 
      return this._success(`Berhasil menyimpan ${berhasil} dan gagal ${gagal}`);
    } catch {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST)
    }
  }



}
