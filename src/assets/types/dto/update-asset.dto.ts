import { ApiProperty } from "@nestjs/swagger";
import {  IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
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

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsUUID("all", { each: true })
    fileIds?: string[]; 
    
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    purchaseDate?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    purchasePrice?: number;
    
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    productionDate?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    employeeId?: string;

}