import { ApiProperty } from "@nestjs/swagger";
import { IsEmail,IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateSupplierDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+\d{6,15}$/, {
      message: 'Phone number must start with "+" followed by 6 to 15 digits',
    })
    phone: string;
    
}