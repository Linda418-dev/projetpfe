import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PlaceType } from "../enums/Place-type.enum";


export class updatePlaceDto{
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;


    @ApiProperty({ 
        example: PlaceType.OPEN_SPACE, 
        description: "Type of the place",
        enum: PlaceType,
        required: false 
    })
    @IsEnum(PlaceType)
    @IsOptional()
    type: PlaceType;

    @ApiProperty()
    @IsString()
    @IsOptional()
    imageUrl: string;
}