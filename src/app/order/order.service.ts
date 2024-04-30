import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Between, Like, Repository } from 'typeorm';
import { Order } from './order.entity';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { CreateOrderDto, UpdateOrderDto, findAllOrderDto } from './order.dto';
import { REQUEST } from '@nestjs/core';

import { Response } from 'express';

@Injectable()
export class OrderService extends BaseResponse {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  generateInvoice(): string {
    return `INV` + new Date().getTime();
  }

  async createOrder(payload: CreateOrderDto): Promise<ResponseSuccess> {

    try {
      const invoice = this.generateInvoice();
      payload.nomor_order = invoice;

      payload.order_detail &&
        payload.order_detail.forEach((item) => {
          item.created_by = this.req.user.id;
        });

      await this.orderRepository.save({
        ...payload,
        konsumen: {
          id: payload.konsumen_id,
        },
      });

      return this._Success('OK');
    } catch (err) {
      console.log('err', err);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  async findAll(query: findAllOrderDto): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      limit,
      nomor_order,
      dari_order_tanggal,
      sampai_order_tanggal,
      status,
      dari_total_bayar,
      sampai_total_bayar,
      nama_konsumen,
    } = query;

    const filterQuery: any = [];

    if (nomor_order) {
      filterQuery.nomor_order = Like(`%${nomor_order}%`);
    }

    if (nama_konsumen) {
      filterQuery.konsumen = {
        nama_konsumen: Like(`%${nama_konsumen}%`),
      };
    }
    if (status) {
      filterQuery.status = Like(`%${status}%`);
    }
    if (dari_total_bayar && sampai_total_bayar) {
      filterQuery.total_bayar = Between(dari_total_bayar, sampai_total_bayar);
    }
    if (dari_total_bayar && !!sampai_total_bayar === false) {
      filterQuery.total_bayar = Between(dari_total_bayar, dari_total_bayar);
    }

    if (dari_order_tanggal && sampai_order_tanggal) {
      filterQuery.tanggal_order = Between(
        dari_order_tanggal,
        sampai_order_tanggal,
      );
    }
    if (dari_order_tanggal && !!sampai_order_tanggal === false) {
      filterQuery.tanggal_order = Between(
        dari_order_tanggal,
        sampai_order_tanggal,
      );
    }

    const total = await this.orderRepository.count({
      where: filterQuery,
    });

    const result = await this.orderRepository.find({
      where: filterQuery,
      relations: [
        'created_by',
        'konsumen',
        'order_detail',
        'order_detail.produk',
      ],
      select: {
        id: true,
        nomor_order: true,
        status: true,
        total_bayar: true,
        tanggal_order: true,

        konsumen: {
          id: true,
          nama_konsumen: true,
        },
        created_by: {
          id: true,
          nama: true,
        },

        order_detail: {
          id: true,

          jumlah: true,
          produk: {
            nama_produk: true,
          },
        },
      },

      skip: limit,
      take: pageSize,
    });
    return this._Pagination('OK', result, total, page, pageSize);
  }
}