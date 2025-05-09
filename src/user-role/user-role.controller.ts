import { Controller, Get, Param } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('role Resource')
@Controller('roles')
export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService) {}

  @Get()
  async getAllRoles() {
    return this.userRoleService.getAllRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    return this.userRoleService.getRoleById(id);
  }
}
