import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ResponseSuccess } from 'src/book/interface';
import { PembelianMobilDTO, updateMobilDto, createMobilArrayDto, DeleteMobilsDto, FindCarDto } from './dto/utsdto';
import { InjectRepository } from '@nestjs/typeorm';
import { PembelianMobil } from './uts.entity';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { from } from 'rxjs';
@Injectable()
export class UtsService {
  constructor(@InjectRepository(PembelianMobil) private readonly mobilRepository: Repository<PembelianMobil>) { }

  async createMobil(createPembelianMobilDTO: PembelianMobilDTO): Promise<ResponseSuccess> {
    const { nama, merek, tipeMobil, harga, tahun } = createPembelianMobilDTO;
    try {
      await this.mobilRepository.save({
        nama: nama,
        merek: merek,
        tipeMobil: tipeMobil,
        harga: harga,
        tahun: tahun
      });
      return {
        status: 'Succes',
        message: 'Berhasil menambahkan mobil',
      }
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async updateMobil(
    id: number,
    updateMobilDto: PembelianMobilDTO,
  ): Promise<ResponseSuccess> {
    const check = await this.mobilRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);

    const update = await this.mobilRepository.save({ ...updateMobilDto, id: id });
    return {
      status: `Success `,
      message: 'Buku berhasil di update',
      data: update,
    };
  }



  async getDetail(id: number): Promise<PembelianMobil> {
    const pembelianMobil = await this.mobilRepository.findOne({ where: { id } });

    if (!pembelianMobil) {
      throw new NotFoundException(`Pembelian mobil dengan ID ${id} tidak ditemukan.`);
    }

    return pembelianMobil;
  }

  async getAll(): Promise<ResponseSuccess> {
    const result = await this.mobilRepository.find();
    return {
      status: 'Success',
      message: 'List Mobil ditemukan',
      data: result,
    };
  }

  async deleteMobil(id: number): Promise<ResponseSuccess> {
    const check = await this.mobilRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!check) {
      throw new NotFoundException(`Mobil dengan id ${id} tidak ditemukan`);
    }

    await this.mobilRepository.delete(id)

    return {
      status: `Success`,
      message: 'Berhasil menghapus Mobil',
    };
  }
  async bulkCreate(payload: createMobilArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.mobilRepository.save(item);
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
  async bulkDelete(payload: DeleteMobilsDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {


            const result = await this.mobilRepository.delete(item);

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

  async filterMobilByCriteria(criteria: FindCarDto): Promise<PembelianMobil[]> {
    const { merekMobil, tipeMobil, hargaMin, hargaMax, tahunMin, tahunMax } = criteria;

    const filter: {
      [key: string]: any;
    } = {};

    if (merekMobil) {
      filter.merekMobil = Like(`%${merekMobil}%`);
    }

    if (tipeMobil) {
      filter.tipeMobil = Like(`%${tipeMobil}%`);
    }

    if (hargaMin && hargaMax) {
      filter.harga = Between(hargaMin, hargaMax);
    } else if (hargaMin) {
      filter.harga = MoreThanOrEqual(hargaMin);
    } else if (hargaMax) {
      filter.harga = LessThanOrEqual(hargaMax);
    }

    if (tahunMin && tahunMax) {
      filter.tahun = Between(tahunMin, tahunMax);
    } else if (tahunMin) {
      filter.tahun = MoreThanOrEqual(tahunMin);
    } else if (tahunMax) {
      filter.tahun = LessThanOrEqual(tahunMax);
    }
    return await this.mobilRepository.find({
      where: filter,
    });
  }
}
