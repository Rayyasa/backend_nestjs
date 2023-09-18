import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ResponseSuccess } from './interface';
import { createBookArrayDto, createBookDto, updateBookDto, DeleteBooksDto, deleteBookDto } from './book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
@Injectable()
export class BookService {

  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) { }

  async getAllBooks(): Promise<ResponseSuccess> {
    const book = await this.bookRepository.find();
    return {
      status: 'Success',
      message: 'Buku Founded!',
      data: book,
    }
  }


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

  async getDetail(id: number): Promise<ResponseSuccess> {
    const book = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    console.log(book);

    if (book === null) {
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
    updateBookDto: updateBookDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!check) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }

    const update = await this.bookRepository.save({ ...updateBookDto, id: id });
    return {
      status: 'success',
      message: 'Berhasil update buku',
      data: update,
    }
  }

  async deleteBook(id: number): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!check) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }

    await this.bookRepository.delete(id)

    return {
      status: `Success`,
      message: 'Berhasil menghapus buku',
    };
  }

  async bulkCreate(payload: createBookArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.bookRepository.save(item);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        })
      )
      return {
        status: 'Ok',
        message: `Berhasil menambahkan buku sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        data: payload
      }
    } catch {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST)
    }
  }
  async bulkDelete(payload: DeleteBooksDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {


            const result = await this.bookRepository.delete(item);

            if (result.affected === 0) {
              gagal = gagal + 1;
            } else {

              berhasil = berhasil + 1;
            }

          } catch {
            gagal = gagal + 1;
          }
        })
      )
      return {
        status: 'Ok',
        message: `Berhasil menghapus buku sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        data: payload
      }
    } catch {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST)
    }
  }


}