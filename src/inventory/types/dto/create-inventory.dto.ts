import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty()
  @IsDateString()
  launchDate: string;  
}


