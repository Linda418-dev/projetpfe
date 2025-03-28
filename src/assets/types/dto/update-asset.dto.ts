import { ApiProperty } from "@nestjs/swagger";
import {   IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
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

    @ApiProperty({ description: 'ID of the service' })
    @IsUUID()
    serviceId: string; 

   

}