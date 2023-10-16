import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseSuccess } from 'src/interface';
import { createUserDto, updateUserDto, createUserArrayDto, DeleteUserArrayDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }
  async getUsers(): Promise<ResponseSuccess> {
    const user = await this.userRepository.find();
    return {
      status: 'Success',
      message: 'User ditemukan',
      data: user,
    }
  }

  async createUsers(createUserDto: createUserDto): Promise<ResponseSuccess> {
    const { id,
      nama,
      email,
      umur,
      tanggal_lahir,
      status } = createUserDto;

    try {
      await this.userRepository.save({
        nama: nama,
        umur: umur,
        tanggal_lahir: tanggal_lahir,
        email: email
      });
      return {
        status: 'Oke',
        message: 'Berhasil menambahkan user!'
      }
    } catch {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST)
    }

  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (detailUser === null) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 'Success',
      message: 'Detail User ditermukan',
      data: detailUser,
    }
  }

  async updateUser(
    id: number,
    updateUserDto: updateUserDto,
  ): Promise<ResponseSuccess> {
    const check = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);

    const update = await this.userRepository.save({ ...updateUserDto, id: id });
    return {
      status: `Success `,
      message: 'User berhasil di update',
      data: update,
    };
  }

  async deleteUsers(id: number): Promise<ResponseSuccess> {
    const check = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    await this.userRepository.delete(id);
    return {
      status: `Success `,
      message: 'Berhasil menghapus User',
    };
  }

  async bulkCreate(payload: createUserArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.userRepository.save(item);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        })
      )
      return {
        status: 'Ok',
        message: `Berhasil menambahkan user sebanyak ${berhasil} dan gagal sebanyak ${gagal}`,
        data: payload
      }
    } catch {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST)
    }
  };
  async bulkDelete(payload: DeleteUserArrayDto): Promise<ResponseSuccess> {
    try {
      let success = 0;
      let fail = 0;
      await Promise.all(
        payload.data.map(async (item) => {
          try {
            const result = await this.userRepository.delete(item);

            if (result.affected === 0) {
              fail = fail + 1;
            } else {
              success = success + 1;
            }
          } catch {
            fail = fail + 1;
          }
        })
      )
      return {
        status: 'Ok',
        message: `Berhasil menghapus user sebanyak ${success} dan gagal sebanyak ${fail}`,
        data: payload
      }
    } catch {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST)
    }
  };



}