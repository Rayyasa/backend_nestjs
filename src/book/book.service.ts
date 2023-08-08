import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BookService {
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
  ];

  getAllBooks(): {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] {
    return this.books;
  }

  createBook(
    title: string,
    author: string,
    year: number,
  ): {
    status: string;
    message: string;
  } {
    this.books.push({
      id: new Date().getTime(),
      title: title,
      author: author,
      year: year,
    });

    return {
      status: 'Success',
      message: 'Berhasil menambakan buku',
    };
  }

  findBookById(id:number) :number {
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }
    return bookIndex;
  }

  getDetail(id:number): {
    id?:number;
    title:string;
    author:string;
    year:number;
  } {
    const bookIndex = this.findBookById(id);
    const book = this.books[bookIndex];
    return book;
  }

  updateBook(
    id: number,
    title:string,
    author:string,
    year:number,
  ) : {
    status:string;
    message:string;
  } {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    this.books[bookIndex].title = title;
    this.books[bookIndex].author = author;
    this.books[bookIndex].year = year;
    
    return {
      status: 'success',
      message: 'Berhasil update buku',
    }
  }
  
  deleteBook(id:number) : {
    status: string;
    message: string;
  } {
    const bookIndex = this.findBookById(id);
    this.books.splice(bookIndex, 1);

    return {
      status: `Succes ${bookIndex}`,
      message: 'Berhasil menghapus buku',
    };
  }



}
