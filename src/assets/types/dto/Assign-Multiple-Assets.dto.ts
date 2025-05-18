import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, ArrayNotEmpty, IsArray } from 'class-validator';

export class AssignMultipleAssetsDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("all", { each: true })  
  assetIds: string[];

  @ApiProperty()
  @IsUUID()
  userId: string;
}
