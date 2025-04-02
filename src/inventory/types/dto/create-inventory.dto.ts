import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}


