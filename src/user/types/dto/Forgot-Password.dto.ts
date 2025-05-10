import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Adresse email de l\'utilisateur pour la réinitialisation du mot de passe',
    example: 'utilisateur@example.com',
  })
  @IsEmail()
  email: string;
}
