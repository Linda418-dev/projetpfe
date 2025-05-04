import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString,  ValidateNested } from "class-validator";
import { CreateServiceDto } from "src/service/types/dto/create-service.dto";

export class CreateDepartmentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @ValidateNested()
    @Type(() => CreateServiceDto)
    @IsOptional()
    services?: CreateServiceDto[];

}