import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";
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
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    keyword?: string;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    supplierId?: string;
  

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    locationId?: string;

    @ApiProperty()
    @IsUUID()
    siteId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    departmentId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    serviceId?: string;


    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    statusId?: string;

    @ApiProperty({ example: 'createdAt' })
    @IsOptional()
    @IsString()
    orderField?: string;
  
    @ApiProperty({ example: 'ASC', enum: SortDirection })
    @IsOptional()
    @IsEnum(SortDirection)
    orderDirection?: SortDirection;
}