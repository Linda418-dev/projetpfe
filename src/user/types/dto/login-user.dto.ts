import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginUserDto {

  @ApiProperty()
   @ValidateIf((o) => !o.email) // Si email n'est pas fourni, username devient obligatoire
   @IsOptional()
  @IsString()
  username?: string;
  
  @ApiProperty()
  @ValidateIf((o) => !o.username) // Si username n'est pas fourni, email devient obligatoire
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
