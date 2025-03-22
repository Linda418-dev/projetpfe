import { ApiProperty } from "@nestjs/swagger";
import {   IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { AssetStatus } from "../enums/asset-status.enum";
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

    @ApiProperty()
    @IsOptional()
    @IsEnum(AssetStatus)
    status?: AssetStatus;

}