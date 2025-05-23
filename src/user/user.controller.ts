import { Body, Controller, Delete, Get, Param, Post,Patch, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { CreateUserDto } from './types/dto/create-user.dto';
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UpdateUserDto } from './types/dto/update-user.dto';
import { BypassInventoryLock } from 'src/inventory/guards/bypass-inventory-lock.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from './types/dto/Forgot-Password.dto';
import { PaginateSearchDto } from './types/dto/paginate-search.dto';
import { NotificationService } from 'src/notification/notification.service';

@ApiBearerAuth()
@ApiTags('user Resource')
@Controller('users')
export class UserController {
    constructor(private readonly userService : UserService,
      private readonly notificationService : NotificationService
    ){}



 @Get('all-users')
@UseGuards(JwtAuthGuard)
async getUsers() {
  return this.userService.getUsers();
}



  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(
  @Query() params: PaginateSearchDto,
  @Req() req: any
) {
  return this.userService.getAllUsers(params);
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
  async deleteUser(@Param('id') targetUserId: string,@Req() req: any ) {
  const currentUserId = req.user.id;
  return this.userService.deleteUser(targetUserId, currentUserId);
 }

 @Patch(':id/deactivate')
@UseGuards(JwtAuthGuard)
async deactivateUser(@Param('id') userId: string, @Req() req: any) {
  const currentUserId = req.user.id;
  return this.userService.deactivateUser(userId, currentUserId);
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
