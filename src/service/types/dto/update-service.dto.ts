import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsString } from "class-validator";

export class UpdateServiceDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

}