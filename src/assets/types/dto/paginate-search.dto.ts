import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { SearchKeyword } from "../interface/paginateKeyword.interface";
import { PaginateDto } from "./paginate.dto";
import { Type } from "class-transformer";
import { ApiProperty} from "@nestjs/swagger";
import { SortDirection } from "../enums/SortDirection.enum";

export class PaginateSearchDto extends PaginateDto implements SearchKeyword{
    @ApiProperty({ example: 0 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    skip?: number;
  
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    take?: number;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiProperty({ example: 'createdAt' })
    @IsOptional()
    @IsString()
    orderField?: string;
  
    @ApiProperty({ example: 'ASC', enum: SortDirection })
    @IsOptional()
    @IsEnum(SortDirection)
    orderDirection?: SortDirection;
}