import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleEnum } from './types/enums/user-role.enum';
import { CreateRoleDto } from './types/dto/create-role.dto';

@ApiTags('role Resource')
@Controller('roles')
export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService) {}

  @Get()
  async getAllRoles() {
    return this.userRoleService.getAllRoles();
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
  return this.userRoleService.createRole(createRoleDto.role);
}

  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    return this.userRoleService.getRoleById(id);
  }
}
