import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

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


  
}
