import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {  IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateLocationDto } from "src/location/types/dto/create-location.dto";

export class CreateServiceDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @ValidateNested({ each: true })  
    @Type(() => CreateLocationDto)
    @IsOptional()  
    locations?: CreateLocationDto[];

}