import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;


  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string;


  @ApiProperty({ description: 'New role ID for the user', required: false })
  @IsOptional()
  @IsUUID()
  roleId?: string;
}
