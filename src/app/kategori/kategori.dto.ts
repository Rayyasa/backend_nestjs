import { OmitType } from "@nestjs/mapped-types";
import { IsInt,IsObject,IsOptional,IsString } from "class-validator";
import { PageRequestDto } from "src/utils/dto/page.dto";

export class KategoriDto {
  @IsInt()
  id?: number;

  @IsString()
  nama_kategori:string;

  @IsObject()
  @IsOptional()
  created_by: {id:number}

  @IsObject()
  @IsOptional()
  updated_by: {id:number}
}
export class CreateKategoriDto extends OmitType(KategoriDto,['id']) {}
export class UpdateKategoriDto extends OmitType(KategoriDto, ['id']) {} 
export class FindAllKategori extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_kategori?: string;
}
export class CreateKategoriArrayDto {
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => CreateKategoriDto)
  data: CreateKategoriDto[];
}