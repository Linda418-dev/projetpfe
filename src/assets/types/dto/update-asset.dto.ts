import { ApiProperty } from "@nestjs/swagger";
import {   IsOptional, IsString, IsUUID } from "class-validator";
export class updateAssetDto{
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;

    @IsOptional()
    @IsUUID()
    categoryId?: string;
    
    @IsOptional()
    @IsUUID()
    supplierId: string;
    
    @IsOptional()
    @IsUUID()
    placeId: string;
}