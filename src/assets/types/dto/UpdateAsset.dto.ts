import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsString } from "class-validator";
export class updateAssetDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}