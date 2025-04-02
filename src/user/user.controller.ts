import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user Resource')
@Controller('users')
export class UserController {
    constructor(private readonly userService : UserService){}

    @Get()
  async getAllUsers() {
    return this.userService.getAllUsers(); 
  }
}
