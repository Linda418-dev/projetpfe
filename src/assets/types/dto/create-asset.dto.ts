import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAssetDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsUUID()
    categoryId: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    supplierId?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    placeId?: string;
    
  
}