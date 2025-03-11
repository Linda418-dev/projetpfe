import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Matches } from "class-validator";


export class UpdateSupplierDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Matches(/^[0-9]{8}$/, { message: "Phone number must be exactly 8 digits" })
    phone: string;
    
}