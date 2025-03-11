import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateFileDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    filename: string;
    
    @ApiProperty()
    @IsUUID() 
    assetId: string;
}