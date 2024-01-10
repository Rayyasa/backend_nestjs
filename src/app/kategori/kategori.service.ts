import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
<<<<<<< HEAD
import { Kategori } from './kategori.entity';
import { CreateKategoriDto, findAllKategori } from './kategori.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { Like, Repository } from 'typeorm';
=======
import { kategori } from './kategori.entity';
import { CreateKategoriArrayDto, CreateKategoriDto, FindAllKategori, UpdateKategoriDto } from './kategori.dto';
import { ResponsePagination, ResponseSucces } from 'src/interface/response';
import { Like, Repository } from 'typeorm'
>>>>>>> 76fee98 (bab kategori kelar)
import { REQUEST } from '@nestjs/core';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @Inject(REQUEST) private req: any,  // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }

  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
<<<<<<< HEAD
      await this.kategoriRepository.save({
        ...payload,
        created_by: {
          id: this.req.user.id,
        },
      });

      return this._Success('OK', this.req.user.user_id);
=======
      await this.kategoriRepository.save(payload);
      return this._success('Oke', payload.created_by.id);
>>>>>>> 76fee98 (bab kategori kelar)
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

<<<<<<< HEAD
  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
=======
  async updateKategori(payload: UpdateKategoriDto, id: number): Promise<ResponseSucces> {
    const checkKategori = await this.kategoriRepository.findOne({ where: { id: id } });

    if (!checkKategori) {
      throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND)
    }
    const updateKategori = await this.kategoriRepository.save({
      ...payload, id: id
    });
    return this._success('Berhasil mengUpdate', updateKategori)
  }

  async getDetail(id: number): Promise<ResponseSucces> {
    const detailKategori = await this.kategoriRepository.findOne({
      where: {
        id,
      }, 
      relations: ['created_by', 'updated_by'],
      select: {
        id: true,
        nama_kategori: true,
        created_by: {
          id: true, // pilih field  yang akan ditampilkan dari tabel user
          nama: true,
        },
        updated_by: {
          id: true, // pilih field yang akan ditampilkan dari tabel user
          nama: true,
        },
      },
    });

    if (detailKategori === null) {
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
    } return {
      status: 'Success',
      message: 'Detail kategori ditemukan',
      data: detailKategori,
    }
  }


  async getAllCategory(query: FindAllKategori): Promise<ResponsePagination> {
>>>>>>> 76fee98 (bab kategori kelar)
    const { page, pageSize, limit, nama_kategori } = query;

    const filterQuery: { [key: string]: any } = {}
    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'], // relasi yang aka ditampilkan saat menampilkan list kategori
      select: {   // pilih data mana saja yang akan ditampilkan dari tabel kategori
        id: true,
        nama_kategori: true,
        created_by: {
          id: true,   // pilih field  yang akan ditampilkan dari tabel user
          nama: true,
        },
        updated_by: {
          id: true, // pilih field yang akan ditampilkan dari tabel user
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._Pagination('OK', result, total, page, pageSize);
  }
<<<<<<< HEAD
}
=======


  async deleteKategori(id: number): Promise<ResponseSucces> {
    const check = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
    await this.kategoriRepository.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus Kategori',
    };
  }
  async bulkCreate(payload: CreateKategoriArrayDto): Promise<ResponseSucces> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (data) => {
          try {
            await this.kategoriRepository.save(data);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      )
      return {
        status: 'Ok',
        message: `Berhasil menambahkan kategori sebanyak ${berhasil} dan gagal ${gagal}`
      }
    } catch {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST)
    }
  }

}
>>>>>>> 76fee98 (bab kategori kelar)
