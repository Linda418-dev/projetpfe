import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { AssetStatus } from '../enums/inventory-details.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDetailsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  inventoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  assetId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  placeId: string;

  @ApiProperty()
  @IsEnum(AssetStatus)
  status: AssetStatus;
}
