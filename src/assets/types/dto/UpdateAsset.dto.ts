import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsOptional, IsString } from "class-validator";
export class updateAssetDto{
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;
    
}