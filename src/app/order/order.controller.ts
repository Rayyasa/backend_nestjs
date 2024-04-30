import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from '../auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-cretaed_by.decorator';
import { CreateOrderDto, UpdateOrderDto, findAllOrderDto } from './order.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';
import { Response } from 'express';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('tambah')
  async createOrder(@InjectCreatedBy() payload: CreateOrderDto) {
    return this.orderService.createOrder(payload);
  }
  @Get('list')
  async listOrder(@Pagination() query: findAllOrderDto) {
    return this.orderService.findAll(query);
  }


  
}