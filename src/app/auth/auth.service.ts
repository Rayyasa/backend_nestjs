import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { User, UserGoogle } from './auth.entity';
import { Equal, Like, Repository } from 'typeorm';
import { ResponseSuccess } from 'src/interface';
import {
  LoginDto,
  LoginGoogleDto,
  RegisterDto,
  ResetPasswordDto,  
} from './auth.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';
import { ResetPassword } from '../mail/reset_password.entity';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    @InjectRepository(UserGoogle)
    private readonly userGoogleRepo: Repository<UserGoogle>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
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
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    console.log('payload sebelum hash', payload);
    payload.password = await hash(payload.password, 12);
    console.log('payload sesudah hash', payload);
    await this.authRepository.save(payload);

    return this._Success('Register Berhasil');
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
    const link = `http://localhost:3010/auth/reset-password/${user.id}/${token}`; //membuat link untuk reset password
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
    const userToken = await this.resetPasswordRepository.findOne({
      //cek apakah user_id dan token yang sah pada tabel reset password
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
        HttpStatus.UNPROCESSABLE_ENTITY, // jika tidak sah , berikan pesan token tidak valid
      );
    }
    const currentDateTime = new Date();
    const expirationDateTime = new Date(
      userToken.created_at.getTime() + 60 * 60 * 1000,
    );

    if (currentDateTime > expirationDateTime) {
      throw new HttpException('Token telah kadaluwarsa', HttpStatus.FORBIDDEN);
    }

    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.authRepository.save({
      // ubah password lama dengan password baru
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepository.delete({
      // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
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
        '1d',
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
        role: 'admin',
      });
    } else {
      throw new HttpException(
        'email atau password anda salah',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async getDataGoogle(id: string) {
    const checkUserExists = await this.userGoogleRepo.findOne({
      where: {
        id: id
      },
      select: {
        id: true,
        nama: true,
        email: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      jwt_config.access_token_secret,
    );

    return this._Success('Login Success', {
      ...checkUserExists,
      access_token: access_token,
      role: 'admin',
    });
  }


  async loginGoogle(payload: LoginGoogleDto) {
    console.log(payload);

    try {
      const resDecode: any = this.jwtService.decode(payload.id_token);

      if (resDecode.email == payload.email) {
        const checkUserExists = await this.userGoogleRepo.findOne({
          where: {
            email: payload.email,
          },
          select: {
            id: true,
            nama: true,
            email: true,
            refresh_token: true,
          },
        });

        if (checkUserExists == null) {
          const jwtPayload: jwtPayload = {
            id: payload.id,
            nama: payload.nama,
            email: payload.email,
          };

          const refresh_token = await this.generateJWT(
            jwtPayload,
            '7d',
            jwt_config.refresh_token_secret,
          );

          await this.userGoogleRepo.save({
            ...payload,
            refresh_token,
            id: payload.id,
          });
        }
      }
    } catch (error) {
      console.log('err', error);
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  // async loginGoogle(payload: LoginGoogleDto): Promise<ResponseSuccess> {
  //   console.log(payload);
  //   try {
  //     const checkUserExists = await this.authRepository.findOne({
  //       where: {
  //         email: payload.email,
  //       },
  //       select: {
  //         id: true,
  //         nama: true,
  //         email: true,
  //         refresh_token: true,
  //       },
  //     });

  //     if (!checkUserExists) {
  //       const jwtPayload: jwtPayload = {
  //         id: payload.id_token,
  //         nama: payload.nama,
  //         email: payload.email,
  //       };

  //       const refresh_token = await this.generateJWT(
  //         jwtPayload,
  //         '7d',
  //         jwt_config.refresh_token_secret,
  //       );

  //       await this.authRepository.save({
  //         refresh_token: refresh_token,
  //         role: 'siswa',
  //         nama: payload.nama,
  //         email: payload.email,
  //         id_token: payload.id_token,
  //       });
  //       return this._Success('Registrasi berhasil');
  //     } else {
  //       const jwtPayload: jwtPayload = {
  //         id: checkUserExists.id,
  //         nama: checkUserExists.nama,
  //         email: checkUserExists.email,
  //       };
  //       const access_token = await this.generateJWT(
  //         jwtPayload,
  //         '7d',
  //         jwt_config.access_token_secret,
  //       );
  //       const refresh_token = await this.generateJWT(
  //         jwtPayload,
  //         '7d',
  //         jwt_config.refresh_token_secret,
  //       );
  //       await this.authRepository.update(checkUserExists.id, {
  //         refresh_token: refresh_token,
  //       });

  //       return this._Success('Login berhasil', {
  //         ...checkUserExists,
  //         access_token: access_token,
  //         refresh_token: refresh_token,
  //       });
  //     }
  //   } catch (error) {
  //     console.log('err', error);
  //     throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
  //   }
  // }

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
      '1d',
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
  async deleteUser(id: number): Promise<ResponseSuccess> {
    // Check if the user exists
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Delete the user
    await this.authRepository.delete(id);

    return {
      status: 'Success',
      message: 'User deleted successfully',
    };
  }
}
