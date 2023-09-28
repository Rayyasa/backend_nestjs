import { OmitType, PickType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min, Max, Length, IsNumber, IsEmail, IsArray, ValidateNested, ArrayNotEmpty, IsOptional } from "class-validator";
import { PageRequestDto } from "src/utils/dto/page.dto";
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
export class createUserArrayDto {
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => createUserDto)
  data: createUserDto[];
}
export class DeleteUserArrayDto {
  @IsArray()
  @ArrayNotEmpty()
  data: [];
}