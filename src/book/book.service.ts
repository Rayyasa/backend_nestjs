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

  getAllBooks(): {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] {
    return this.books;
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
  createBook(payload: any): { status: string, message: string } {
    const { title, author, year } = payload;
    this.books.push({
      id: this.books.length,
      title: title,
      author: author,
      year: year
    });
    return {
      status: 'oke',
      message: 'berhasil'
    }
  }

  private findBookById(id: number): number {
    //Mencari Index berdasarkan id
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }
    return bookIndex;
  }
  getDetail(id: number): {
    id?: number;
    title: string;
    author: string;
    year: number;
  } {
    const bookIndex = this.findBookById(id);
    const book = this.books[bookIndex];
    return book;
  }
  updateBook(
    id: number,
    payload:any,
  ): {
    status: string;
    message: string;
  } {
    const bookIndex = this.findBookById(id);
    const {title, author , year} = payload;
    this.books[bookIndex].title = title;
    this.books[bookIndex].author = author;
    this.books[bookIndex].year = year;
    return {
      status: 'success',
      message: 'Berhasil update buku',
    }
  }

  deleteBook(id: number): {
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


  // updateBook(): {status:string; message: string} {
  //   return{
  //     status: 'Oke',
  //     message: 'Berhasil mempebaharui buku'
  //   }
  // }



}
