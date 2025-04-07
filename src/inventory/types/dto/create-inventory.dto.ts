import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsArray, IsDateString } from 'class-validator';
import { StatusEnum } from 'src/status/types/enums/status.enum';

export class CreateInventoryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Inventory name is required' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Place ID is required' })
  @IsUUID('4', { message: 'Invalid place ID format' })
  placeId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString({}, { message: 'Start date must be a valid ISO date' })
  startDate: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date' })
  endDate?: string;

  @ApiProperty({
    description: 'Status of the inventory',
    enum: StatusEnum,  
    default: StatusEnum.PENDING,  
  })
  @IsOptional()
  status?: StatusEnum;
  
  @ApiProperty({
    required: false,
    description: 'List of operators and their department assignments',
    example: [
      { userId: 'uuid-user-linda', departmentIds: ['uuid-depA', 'uuid-depB'] },
      { userId: 'uuid-user-sinda', departmentIds: ['uuid-depC'] },
    ]
  })
  @IsOptional()
  @IsArray()
  operatorAssignments?: {
    userId: string;
    departmentIds: string[];
  }[];
}
