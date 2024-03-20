import { PickType } from '@nestjs/mapped-types';
import { UsersDto } from '../auth/auth.dto';

export class UpdateProfileDto extends PickType(UsersDto, [
  'avatar',
  'nama',
  'id',
]) { }