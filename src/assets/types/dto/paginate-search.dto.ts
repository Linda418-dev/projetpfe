import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { SearchKeyword } from "../interface/paginateKeyword.interface";
import { PaginateDto } from "./paginate.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PaginateSearchDto extends PaginateDto implements SearchKeyword{
    @ApiProperty()
    @IsInt()    
    @Type(() => Number)
    skip:number;


    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    take: number;

    @ApiProperty()
    @IsString()
    keyword: string;
}