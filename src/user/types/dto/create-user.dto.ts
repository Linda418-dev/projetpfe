import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';
import { UserRoleEnum } from 'src/user-role/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty()
  @ValidateIf((o) => !o.email) // Si email est vide, username devient obligatoire
  @IsNotEmpty({ message: 'Le username est requis si l’email est vide' })
  @IsString()
  username?: string;

  @ApiProperty()
  @ValidateIf((o) => !o.username) // Si username est vide, email devient obligatoire
  @IsNotEmpty({ message: 'L’email est requis si le username est vide' })
  @IsEmail({}, { message: 'Format de l’email invalide' })
  email?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @ApiProperty()
  @IsEnum(UserRoleEnum, { message: 'Invalid role' })
  @IsNotEmpty({ message: 'Le rôle est obligatoire' })
  role: UserRoleEnum;
}
