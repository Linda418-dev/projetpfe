import { IsEnum } from 'class-validator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
