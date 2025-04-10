import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsString } from "class-validator";

export class UpdateLocationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

}