import { ApiProperty } from "@nestjs/swagger";
import { IsEmail,  IsOptional, IsString, Matches } from "class-validator";


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
    @Matches(/^(\+)?\d{6,15}$/, {
    message: 'Phone number must optionally start with "+" followed by 6 to 15 digits',})
    phone: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    siteId?: string;
    
}