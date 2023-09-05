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


  private users: {
    id: number,
    nama: string,
    email: string,
    umur: number,
    tanggal_lahir: string,
    status: string
  }[] = [
      {
        id: 1,
        nama: "Rayya",
        email: "Rayya.a192018@gmail.com",
        umur: 16,
        tanggal_lahir: "16 November 2006",
        status: "Murid",
      },
      {
        id: 2,
        nama: "Dobleh",
        email: "admwaihdiuqw@gmail.com",
        umur: 16,
        tanggal_lahir: "17 Agustus 2006",
        status: "Murid",
      },
      {
        id: 3,
        nama: "Udin",
        email: "awdumuqddaijs@gmail.com",
        umur: 16,
        tanggal_lahir: "18 September 2006",
        status: "Murid",
      },
    ]

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


  private findUsersById(id: number): number {
    const usersIndex = this.users.findIndex((user) => user.id === id);

    if (usersIndex === -1) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    }
    return usersIndex;
  }

  getDetail(id: number): {
    id: number;
    nama: string;
    email: string;
    umur: number;
    tanggal_lahir: string;
    status: string;
  } {
    const userIndex = this.findUsersById(id);
    const user = this.users[userIndex];

    return user;
  }

  updateUser(id: number, updateUserDto:updateUserDto): ResponseSuccess{
    const userIndex = this.findUsersById(id);
    const {
      nama,
      email,
      umur,
      tanggal_lahir,
      status } = updateUserDto;
    this.users[userIndex].nama = nama;
    this.users[userIndex].email = email;
    this.users[userIndex].umur = umur;
    this.users[userIndex].tanggal_lahir = tanggal_lahir;
    this.users[userIndex].status = status;

    return {
      status: "succes",
      message: "Berhasil Mengupdate user!",
    }
  }

  // deleteUsers(id:number) : {status: string, message :string} {
  //   const userIndex = this.findUsersById(id);
  //   this.users.splice(userIndex, 1);
  //   return {
  //     status: 'Success',
  //     message: 'Berhasil menghapus User!',
  //   };
  // }


  deleteUsers(id: number): ResponseSuccess {
    this.users = this.users.filter(user => user.id !== id);
    return {
      status: 'Success',
      message: 'Berhasil menghapus User!',
    }
  }
}
