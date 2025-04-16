import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsArray, IsDateString, IsBoolean } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  operatorIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  allOperators?: boolean;

  @ApiProperty()
  @IsUUID()
  siteId: string;
 
}
