import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAnomalyDto {
    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true }) 
    fileIds?: string[];

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    assetId?: string;
    
}
