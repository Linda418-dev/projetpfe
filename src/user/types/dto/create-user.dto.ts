import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRoleEnum } from 'src/user-role/enums/user-role.enum';


export class CreateUserDto {
   @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
 @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsEnum(UserRoleEnum , { message: 'Invalid role' })
  @IsNotEmpty()
  role: UserRoleEnum; 
}
