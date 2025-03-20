import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string;
}