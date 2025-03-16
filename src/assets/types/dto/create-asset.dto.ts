import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateAssetDto {
    @ApiProperty({ description: 'Name of the asset' })
    @IsNotEmpty()
    name: string;


    @ApiProperty({ description: 'ID of the file to associate (optional)', required: false })
    fileId?: string; 
}
