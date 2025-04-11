import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAssetDto {
   @ApiProperty()
    @IsString()
    name: string;
  
    @ApiProperty()
    @IsString()
    categoryId: string;
    
    @ApiProperty()
    @IsString()
    supplierId: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    fileIds?: string[];
    
}
