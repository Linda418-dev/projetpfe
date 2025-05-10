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
    @Matches(/^\+216\d{8}$/, { message: "Phone number must start with +216 and have 8 digits" })
    phone: string;
    
}