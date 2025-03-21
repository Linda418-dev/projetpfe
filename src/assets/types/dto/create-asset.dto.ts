import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { AssetStatus } from "../enums/asset-status.enum";

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

    @ApiProperty({ description: 'ID of the service' })
    @IsUUID()
    serviceId: string; 

    
    @IsOptional()
    @IsEnum(AssetStatus)
    status?: AssetStatus;


    
}
