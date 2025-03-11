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
    @Matches(/^[0-9]{8}$/, { message: "Phone number must be exactly 8 digits" })
    phone: string;
    
}