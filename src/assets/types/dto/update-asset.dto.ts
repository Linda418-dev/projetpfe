import { ApiProperty } from "@nestjs/swagger";
import {  IsArray, IsOptional, IsString, IsUUID } from "class-validator";
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

    @IsOptional()
    @IsUUID()
    @ApiProperty()
    statusId?: string;

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsUUID("all", { each: true })
    fileIds?: string[];


    

}