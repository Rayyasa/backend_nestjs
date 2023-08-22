import { OmitType, PickType } from "@nestjs/mapped-types";
import { IsInt, IsNotEmpty, Min, Max, Length, IsNumber, IsEmail } from "class-validator";
export class UserDto {
  status: string;
  
  @IsNumber()
  id: number;

  @IsNotEmpty()
  nama: string;
  
  @IsNotEmpty()
  @IsInt()
  @Max(30)
  umur: number;

  @IsNotEmpty()
  tanggal_lahir: string;

  @IsEmail() 
  email:string;
  

}

export class createUserDto extends PickType(UserDto, ["id", "email", "nama", "status", "tanggal_lahir", "umur"]) {}
export class updateUserDto extends PickType(UserDto, ["id", "email", "nama", "status", "tanggal_lahir", "umur"]) {}
