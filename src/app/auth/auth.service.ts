import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { ResponseSuccess } from 'src/interface';
import { LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';
import { ResetPassword } from '../mail/reset_password.entity';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';


@Injectable()
export class AuthService extends BaseResponse {
  constructor(@InjectRepository(User) private readonly authRepository: Repository<User>, @InjectRepository(ResetPassword) private readonly resetPasswordRepository: Repository<ResetPassword>, private jwtService: JwtService, private mailService: MailService) {
    super();
  }
  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
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

    console.log('payload sebelum hash', payload);
    payload.password = await hash(payload.password, 12);
    console.log('payload sesudah hash', payload);
    await this.authRepository.save(payload);

    return this._Success("Register Berhasil");
  }

  async getAllUser(): Promise<ResponseSuccess> {
    const result = await this.authRepository.find();
    return {
      status: 'Success',
      message: 'list user ditemukan',
      data: result,
    };
  }
  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = randomBytes(32).toString('hex'); // membuat token
    const link = `http://localhost:5002/auth/reset-password/${user.id}/${token}`; //membuat link untuk reset password
    await this.mailService.sendForgotPassword({
      email: email,
      name: user.nama,
      link: link,
    });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };

    await this.resetPasswordRepository.save(payload); // menyimpan token dan id ke tabel reset password

    return this._Success('Silahkan Cek Email');
  }
  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({    //cek apakah user_id dan token yang sah pada tabel reset password
      where: {
        token: token,
        user: {
          id: user_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY,  // jika tidak sah , berikan pesan token tidak valid
      );
    }
    const currentDateTime = new Date();
    const expirationDateTime = new Date(userToken.created_at.getTime() + 60 * 60 * 1000); 

    if (currentDateTime > expirationDateTime) {
      throw new HttpException(
        'Token telah kadaluwarsa',
        HttpStatus.FORBIDDEN,
      );
    }


    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.authRepository.save({  // ubah password lama dengan password baru
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepository.delete({ // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
      user: {
        id: user_id,
      },
    });

    return this._Success('Reset Passwod Berhasil, Silahkan login ulang');
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    );

    if (checkPassword) {
      const jwtPayload: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '10s',
        jwt_config.access_token_secret,
      );
      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      );
      await this.authRepository.save({
        refresh_token: refresh_token,
        id: checkUserExists.id,
      });
      return this._Success('Login Success', {
        ...checkUserExists,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  async myProfile(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });

    return this._Success('OK', user);
  }
  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    console.log('user', checkUserExists);
    if (checkUserExists === null) {
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1m',
      jwt_config.access_token_secret,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '7d',
      jwt_config.refresh_token_secret,
    );

    await this.authRepository.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
    });

    return this._Success('Success', {
      ...checkUserExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

}

