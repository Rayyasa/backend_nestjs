import { IsIn } from 'class-validator';

export class ToyotaMobilDTO {
  @IsIn(['Avanza', 'Innova', 'Raize'], { message: 'Tipe mobil toyota harus Avanza, Innova, atau Raize.' })
  tipeMobil: string;
}
