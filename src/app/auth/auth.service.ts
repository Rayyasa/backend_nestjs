import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Users } from './auth.entity';
import { Repository } from 'typeorm';
import { ResponseSuccess } from 'src/interface';
import { RegisterDto } from './auth.dto';
import { hash } from 'bcrypt';


@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(Users) private readonly authRepository: Repository<Users>
  ) {
    super()
  }

  async register(payload:RegisterDto) : Promise<ResponseSuccess> {
    
  }

 }
