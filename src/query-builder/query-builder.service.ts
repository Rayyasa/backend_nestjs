import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/app/auth/auth.entity';
import BaseResponse from 'src/utils/response/base.response';
import { Repository } from 'typeorm';
import { latihanQueryBuilderDto } from './query-builder.dto';
import { Produk } from 'src/app/produk/produk.entity';

@Injectable()
export class QueryBuilderService extends BaseResponse {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
  ) {
    super();
  }


  async latihan2(query: latihanQueryBuilderDto) {
    const { nama_produk, stok, limit, page, pageSize } = query;
    const queryBuilder = await this.produkRepository.createQueryBuilder(
      'produk',
    );

    if (nama_produk) {
      queryBuilder.where(`produk.nama_produk LIKE :nama_produk`, {
        nama_produk: `%${nama_produk}%`,
      });
    }

    if (stok) {
      queryBuilder.andWhere(`produk.stok LIKE :stok`, {
        stok: stok,
      });
    }

    queryBuilder
      .leftJoin(`produk.created_by`, 'created_by')
      .leftJoin(`produk.updated_by`, 'updated_by')
      .select([
        'produk.id',
        'produk.nama_produk',
        'produk.stok',
        'produk.harga',
        'produk.deskripsi_produk',
        'created_by.nama',
        'updated_by.nama',
      ])

      .skip(limit)
      .take(pageSize);

    const result = await queryBuilder.getMany();
    const total = await queryBuilder.getCount();

    return this._Pagination('OK', result, total, page, pageSize);
  }
}