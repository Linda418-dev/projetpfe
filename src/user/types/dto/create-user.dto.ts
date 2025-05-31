import { ApiProperty } from '@nestjs/swagger';
import { IsEmail,  IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  
  @ApiProperty({ description: 'ID of the user role' })
  @IsNotEmpty()
  @IsUUID()
  roleId: string;


  @ApiProperty({ description: 'ID of the user role' })
  @IsNotEmpty()
  @IsUUID()
  siteId?: string;

  
}

