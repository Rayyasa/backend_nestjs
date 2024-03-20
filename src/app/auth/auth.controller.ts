import { Controller, Post, Body, UseGuards, Get, Req, Param, Delete, Put } from '@nestjs/common';
import { LoginDto, LoginGoogleDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { ResponseSuccess } from 'src/interface/response.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: string): Promise<ResponseSuccess> {
    return this.authService.deleteUser(Number(id));
  }
  @Get('/list')
  findAllUser() {
    return this.authService.getAllUser();
  }
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('login-google')
  async logingoogle(@Body() payload: LoginGoogleDto) {
    return this.authService.loginGoogle(payload)
  }
  @Get('getdatagoogle/:id')
  async getData(@Param('id') id: string) {
    return this.authService.getDataGoogle(id);
  }
  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() req) {
    const { id } = req.user;
    console.log('informasi login user', req.user);
    return this.authService.myProfile(Number(id));
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }

  @Post('lupa-password')
  async forgotPassowrd(@Body('email') email: string) {
    console.log('email', email);
    return this.authService.forgotPassword(email);
  }
  @Post('reset-password/:user_id/:token')  // url yang dibuat pada endpont harus sama dengan ketika kita membuat link pada service forgotPassword
  async resetPassword(
    @Param('user_id') user_id: string,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(+user_id, token, payload);
  }

}

