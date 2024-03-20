import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsEmail, IsInt, IsString, Length, MinLength, minLength } from "class-validator";

export class UsersDto {
  @IsInt()
  id: number;

  @IsString()
  nama: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;
}
export class UserGoogleDto {
  @IsString()
  id: string;

  @IsString()
  nama: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  refresh_token: string;

  @IsString()
  id_token: string;

  @IsString()
  role: string;
}
export class RegisterDto extends PickType(UsersDto, [
  "nama",
  "email",
  "password"
]) { }

export class LoginDto extends PickType(UsersDto, ['email', 'password']) { }
export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  new_password: string;
}
export class LoginGoogleDto extends PickType(UserGoogleDto, ['id',
  'nama',
  'avatar',
  'email',
  'id_token',]) { }