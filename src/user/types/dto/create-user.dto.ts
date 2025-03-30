import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';
import { UserRoleEnum } from 'src/user-role/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Format de l’email invalide' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @ApiProperty()
  @IsEnum(UserRoleEnum, { message: 'Invalid role' })
  @IsNotEmpty({ message: 'Le rôle est obligatoire' })
  role: UserRoleEnum;
}

