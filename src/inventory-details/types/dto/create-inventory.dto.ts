import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDetailsDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  affectationId: string;

 
}
