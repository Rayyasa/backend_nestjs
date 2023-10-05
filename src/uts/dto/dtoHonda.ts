import { IsIn } from 'class-validator';

export class HondaMobilDTO {
  @IsIn(['CRV', 'BRV', 'HRV'], { message: 'Tipe mobil honda harus CRV, BRV, atau HRV.' })
  tipeMobil: string;
}
