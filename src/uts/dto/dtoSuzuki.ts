import { IsIn } from 'class-validator';

export class SuzukiMobilDTO {
  @IsIn(['Ertiga', 'XL7', 'baleno'], { message: 'Tipe mobil suzuki harus Ertiga, XL7, atau baleno.' })
  tipeMobil: string;
}
