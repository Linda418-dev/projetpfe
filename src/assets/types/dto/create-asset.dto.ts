import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateAssetDto {
   @ApiProperty({ description: 'Name of the asset' })
    @IsString()
    assetName: string;
  
    @ApiProperty({ description: 'Name of the category' })
    @IsString()
    categoryName: string;
    
    @ApiProperty({ description: 'Name of the supplier' })
    @IsString()
    supplierName: string;
  
  
    @ApiProperty({ description: 'ID of the file' })
    @IsUUID()
    fileId: string;
    
}
