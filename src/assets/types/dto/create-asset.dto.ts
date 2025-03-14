import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({ description: 'Name of the asset' })
  name: string;

  @ApiProperty({ description: 'ID of the file to associate (optional)', required: false })
  fileId?: string;  
}
