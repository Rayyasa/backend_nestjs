import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Kategori } from './kategori.entity';
import { CreateKategoriArrayDto, CreateKategoriDto, findAllKategori, UpdateKategoriDto } from './kategori.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/index';
import { Like, Repository } from 'typeorm'
import { REQUEST } from '@nestjs/core';
import { User } from '../auth/auth.entity';
@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @Inject(REQUEST) private req: any,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super()
  }
  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      console.log('req', this.req.user);
      await this.kategoriRepository.save(payload);
      return this._Success('Oke', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada kesalahan', HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async updateKategori(payload: UpdateKategoriDto, id: number): Promise<ResponseSuccess> {
    const checkKategori = await this.kategoriRepository.findOne({ where: { id: id } });

    if (!checkKategori) {
      throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND)
    }
    Object.assign(checkKategori, payload);
    const updateKategori = await this.kategoriRepository.save({
      ...payload, id: id
    });
    return this._Success('Berhasil mengupdate kategori', updateKategori)
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
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


  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_kategori, nama_user } = query;

    const filterQuery: any = {}
    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
    if (nama_user) {
      filterQuery.created_by = { nama: Like(`%${nama_user}%`) };
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'],
      select: {
        id: true,
        nama_kategori: true,
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._Pagination('OK', result, total, page, pageSize);
  }


  async clearData(): Promise<ResponseSuccess> {
    await this.kategoriRepository.clear();
    return {
      status: 'Success',
      message: 'Berhasil menghapus semua data kategori',
    };
  }

  async deleteKategori(id: number): Promise<ResponseSuccess> {
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
  async bulkCreate(payload: CreateKategoriArrayDto): Promise<ResponseSuccess> {
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
