import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAnomalyDto {
    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true }) // <- vérifie que chaque ID est bien un UUID
    fileIds?: string[];

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    inventoryDetailId?: string;
    
}
