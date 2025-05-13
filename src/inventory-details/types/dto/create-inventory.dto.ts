import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateInventoryDetailsDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  affectationId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  assetStatusId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  locationHistoryId?: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty()
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  fileIds?: string[];


}
