import { ApiProperty } from "@nestjs/swagger";
import {  IsOptional, IsString, IsUUID } from "class-validator";
export class updateAssetDto{
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    categoryId?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    supplierId: string;

    @IsOptional()
    @IsUUID()
    @ApiProperty()
    locationId?: string;

    

}