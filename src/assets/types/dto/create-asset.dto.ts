import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAssetDto {
   @ApiProperty()
    @IsString()
    name: string;
  
    @ApiProperty()
    @IsUUID()
    categoryId: string;
    
    @ApiProperty()
    @IsUUID()
    supplierId: string;

    @ApiProperty()
    @IsUUID()
    locationId: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    fileIds?: string[];
    
}
