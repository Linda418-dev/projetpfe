import { IsOptional, IsString, IsDateString, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OperatorAssignmentDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsArray()
  @IsUUID('all', { each: true })
  departmentIds: string[];
}

export class UpdateInventoryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;


  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startDate?: string;


  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  placeId?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OperatorAssignmentDto)
  operatorAssignments?: OperatorAssignmentDto[];
}
