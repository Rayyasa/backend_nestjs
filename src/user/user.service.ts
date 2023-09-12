import { Injectable, NotFoundException,HttpException,HttpStatus } from '@nestjs/common';
import { ResponseSuccess } from 'src/book/interface';
import { createUserDto, updateUserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}


  // private users: {
  //   id: number,
  //   nama: string,
  //   email: string,
  //   umur: number,
  //   tanggal_lahir: string,
  //   status: string
  // }[] = [
  //     {
  //       id: 1,
  //       nama: "Rayya",
  //       email: "Rayya.a192018@gmail.com",
  //       umur: 16,
  //       tanggal_lahir: "16 November 2006",
  //       status: "Murid",
  //     },
  //     {
  //       id: 2,
  //       nama: "Dobleh",
  //       email: "admwaihdiuqw@gmail.com",
  //       umur: 16,
  //       tanggal_lahir: "17 Agustus 2006",
  //       status: "Murid",
  //     },
  //     {
  //       id: 3,
  //       nama: "Udin",
  //       email: "awdumuqddaijs@gmail.com",
  //       umur: 16,
  //       tanggal_lahir: "18 September 2006",
  //       status: "Murid",
  //     },
  //   ]

 async getUsers(): Promise <ResponseSuccess> {
  const user = await this.userRepository.find();
  return {
    status:'Success',
    message: 'User ditemukan',
    data: user,
  }
}

 async createUsers(createUserDto:createUserDto): Promise <ResponseSuccess> {
    const { id,
      nama,
      email,
      umur,
      tanggal_lahir,
      status } = createUserDto;

      try {
        await this.userRepository.save({
          nama:nama,
          umur:umur,
          tanggal_lahir:tanggal_lahir,
          email:email
        });
        return {
          status: 'Oke',
          message: 'Berhasil menambahkan user!'
        }
      } catch {
        throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST)
      }
    
  }

 async getDetail(id: number): Promise <ResponseSuccess> {
    const detailUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if(detailUser === null) {
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
}