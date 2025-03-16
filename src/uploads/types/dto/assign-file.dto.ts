import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AssignFileToAssetDto {
  @ApiProperty({ description: 'name asset ' })
  @IsString()
  assetName: string;

  @ApiProperty({ description: 'name category ' })
  @IsString()
  categoryName: string;
  
  @ApiProperty({ description: 'name supplier ' })
  @IsString()
  supplierName: string;


  @ApiProperty({ description: 'Id file' })
  @IsUUID()
  fileId: string;
}
