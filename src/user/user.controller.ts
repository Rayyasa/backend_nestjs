import { Controller, Delete, Get, Param, Post, Put, Body } from '@nestjs/common';
import { UserService} from './user.service';
@Controller('user')
export class UserController {
  constructor (private userService: UserService) {}


  @Get('/list')
  findUsers() {
    return this.userService.getUsers();
  }

  @Post('/create')
  createUsers(@Body() payload:any) {
    return this.userService.createUsers(payload)
  }


  @Get('detail/:id')
  findOneUsers(@Param('id') id:string) {
    return this.userService.getDetail(+id);
  }

  @Put('update/:id')
  updateUser(@Param('id') id: string, @Body() payload:any) {
    return this.userService.updateUser(+id, payload);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id:string) {
    return this.userService.deleteUsers(+id);
  }


}
