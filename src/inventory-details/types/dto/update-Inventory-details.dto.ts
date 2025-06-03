import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsArray } from 'class-validator';

export class UpdateInventoryDetailsDto {
  @ApiProperty()
  @IsUUID()
  assetId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  newStatusId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  newLocationId?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  newFileIds?: string[];
}
