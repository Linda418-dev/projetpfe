import { IsInt } from "class-validator";

export class PaginateDto{
    @IsInt()
    take:number;

    @IsInt()
    skip:number;
}