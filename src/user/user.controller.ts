import { Body, Controller, Delete, Get, Param, Post,Patch, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { CreateUserDto } from './types/dto/create-user.dto';
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UpdateUserDto } from './types/dto/update-user.dto';
import { BypassInventoryLock } from 'src/inventory/guards/bypass-inventory-lock.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('user Resource')
@Controller('users')
export class UserController {
    constructor(private readonly userService : UserService){}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers(); 
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @BypassInventoryLock()
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin') 
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @BypassInventoryLock()
   @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin') 
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deactivateUser(
  @Param('id') targetUserId: string,
  @Req() req: any // ou via décorateur @User() si tu as un custom decorator
 ) {
  const currentUserId = req.user.id;
  return this.userService.deactivateUser(targetUserId, currentUserId);
}

  
  @BypassInventoryLock()
  @Patch(':id/activate')
   // @UseGuards(JwtAuthGuard, RolesGuard)
   // @Roles('admin')
    async activateUser(@Param('id') id: string) {
     return this.userService.activateUser(id);
  }

  @Post('me/player-id/:playerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePlayerId(
    @Param('playerId') playerId: string, @Req() req,) {
    return this.userService.updatePlayerId(req.user.id, playerId);
  }

}
