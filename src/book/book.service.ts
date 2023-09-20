import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ResponsePagination, ResponseSuccess } from './interface';
import { createBookArrayDto, createBookDto, updateBookDto, DeleteBooksDto, deleteBookDto, FindBookDto } from './book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Between, Like, Repository } from 'typeorm';
@Injectable()
export class BookService {

  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) { }

  async getAllBooks(findBookDto: FindBookDto): Promise<ResponsePagination> {
    const { page, pageSize, title, author, from_year, to_year } = findBookDto;
    
    
    const filter: {
      [key: string]: any;
    } = {};

    if (title) {
      filter.title = Like(`%${title}%`);
    }
    if (author) {
      filter.author = Like(`%${author}%`);
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }

    const total = await this.bookRepository.count(
      {
        where:filter
      }
    );
    
    const result = await this.bookRepository.find({
      where:filter,
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    const total_page = Math.ceil(total / pageSize);
    return {
      status: 'Success',
      message: 'Buku Founded!',
      data: result,
      pagination: {
        total: total,
        page: Number(page),
        pageSize: Number(pageSize),
        total_page: total_page,
        remaining_page: total_page - Number(page)
      }
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