import { ApiProperty } from '@nestjs/swagger';

export class AssignFileToAssetDto {
  @ApiProperty({ description: 'ID of the file' })
  fileId: string;

  @ApiProperty({ description: 'Name of the asset' })
  assetName: string;
}
