import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignTechnicianDto {
  @ApiProperty()
  @IsUUID()
  technicianId: string;
}
