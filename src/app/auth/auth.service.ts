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
 }
