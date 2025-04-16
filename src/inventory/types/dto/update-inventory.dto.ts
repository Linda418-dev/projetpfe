import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


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

 
}
