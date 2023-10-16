import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { ResponseSuccess } from 'src/interface';
import { RegisterDto } from './auth.dto';
import { hash } from 'bcrypt';


@Injectable()
export class AuthService extends BaseResponse {
  constructor(@InjectRepository(User) private readonly authRepository: Repository<User>) {
    super();
  }

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExists) {
      throw new HttpException("User already registered", HttpStatus.FOUND);
    }


    console.log('payload sebelum hash',payload);
    payload.password = await hash(payload.password, 12);
    console.log('payload sesudah hash', payload);
await this.authRepository.save(payload);

    return this._Success("Register Berhasil");
  }

 }
