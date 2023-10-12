import { OmitType, PickType } from "@nestjs/mapped-types";
import { IsInt, IsNotEmpty, Min, Max, Length, IsArray, ValidateNested, ArrayNotEmpty, IsOptional, isInt } from "class-validator";
import { Type } from 'class-transformer';
import { PageRequestDto } from "src/utils/dto/page.dto";
export class BookDto {
  id: number;

  @IsNotEmpty()
  @Length(4, 100)
  title: string;

  @IsNotEmpty()
  author: string;


  @IsInt()
  @Min(2020)
  @Max(2023)
  year: number;

}

export class createBookDto extends OmitType(BookDto, ["id"]) { }
export class deleteBookDto extends OmitType(BookDto, ["id"]) { }
export class updateBookDto extends PickType(BookDto, ["title", 'author', 'year']) {}
export class createBookArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createBookDto)
  data: createBookDto[];
}
export class DeleteBooksDto {
  @IsArray()
  @ArrayNotEmpty()
  data: number[];
}

export class FindBookDto extends PageRequestDto{
  @IsOptional()
  title: string;

  @IsOptional()
  author: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_year: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_year: number;
}