import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './auth.guard';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }
  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() req) {
    console.log('informasi login user', req.user);
    return 'ok';
  }
}

