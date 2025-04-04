import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/types/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/user/types/dto/login-user.dto';
import { BypassInventoryLock } from 'src/inventory/guards/bypass-inventory-lock.decorator';

@ApiTags('Accounts Resource')
@Controller('Accounts')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*@BypassInventoryLock() 
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }*/
  @BypassInventoryLock() 
  @Post('signin')
  async signin(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signin(loginUserDto);
  }
}
