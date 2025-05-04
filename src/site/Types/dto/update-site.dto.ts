import { ApiProperty } from "@nestjs/swagger";
import {  IsOptional, IsString } from "class-validator";

export class updateSiteDto{
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;   
}