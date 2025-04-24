import { IsInt, IsOptional } from "class-validator";

export class PaginateDto{
    @IsOptional()
    @IsInt()
    take?: number;

    @IsOptional()
    @IsInt()
    skip?: number;
}