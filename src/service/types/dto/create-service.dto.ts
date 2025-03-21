import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateServiceDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    serviceLocation: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    departmentId: string;

}