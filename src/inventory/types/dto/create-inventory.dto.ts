import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [String], description: 'List of operator IDs' })
  @IsArray()
  @IsOptional()
  operatorIds?: string[];  

}


