import { Controller,Post,Body } from '@nestjs/common';
import { RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

 @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

}
