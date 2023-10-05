import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsArray, ValidateNested, ArrayNotEmpty, IsNotEmpty, ValidationArguments, ValidateIf, ValidatorConstraint, ValidatorConstraintInterface, Validate, IsOptional, IsIn, ValidationOptions, registerDecorator, IsString, IsNumber } from 'class-validator';
import { IsValidCarModel } from '../fncuts';

export class PembelianMobilDTO {
  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  merek: string

  @IsNotEmpty()
  @IsString()
  @IsIn(
    ['CRV', 'BRV', 'HRV', 'Avanza', 'Innova', 'Raize', 'Ertiga', 'XL7', 'Baleno',], { message: 'Tipe mobil tidak tersedia', })
  @IsValidCarModel({ message: 'Tipe tidak Valid' })
  tipeMobil: string;

  @IsNotEmpty()
  @IsInt()
  @Min(150000000)
  @Max(400000000)
  harga: number;

  @IsNotEmpty()
  @IsInt()
  @Min(2017)
  @Max(2023)
  tahun: number;

}

export class updateMobilDto extends (PembelianMobilDTO) { }
export class createMobilArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PembelianMobilDTO)
  data: PembelianMobilDTO[];
}
export class DeleteMobilsDto extends PembelianMobilDTO {
  @IsArray()
  @ArrayNotEmpty()
  data: number[];
}

export class FindCarDto {
  @IsOptional()
  @IsString()
  merekMobil?: string;

  @IsOptional()
  @IsString()
  tipeMobil?: string;

  @IsOptional()
  @IsNumber()
  @Min(150000000)
  @Max(400000000)
  hargaMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(150000000)
  @Max(400000000)
  hargaMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(2017)
  @Max(2023)
  tahunMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(2017)
  @Max(2023)
  tahunMax?: number;
}