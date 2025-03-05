import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PlaceType } from "../enums/Place-type.enum";


export class updatePlaceDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ 
        example: PlaceType.OPEN_SPACE, 
        description: "Type of the place",
        enum: PlaceType,
        required: false 
    })
    @IsEnum(PlaceType)
    @IsNotEmpty()
    type: PlaceType;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    imageUrl: string;
}