import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAssetDto {
    @ApiProperty()
    @IsString()
    name: string;
  
    @ApiProperty()
    @IsUUID()
    categoryId: string;
    
    @ApiProperty()
    @IsUUID()
    supplierId: string;

   
    @ApiProperty()
    @IsUUID()
    locationId: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    fileIds?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    employeeId?: string;

    @ApiProperty({ required: false, example: "YYYY-MM-JJ" })
    @IsOptional()
    @IsDateString()
    purchaseDate?: Date;

    @ApiProperty({ required: false, example: 1499.99 })
    @IsOptional()
    @IsNumber()
    purchasePrice?: number;
    
    @ApiProperty({ required: false, example: "YYYY-MM-JJ" })
    @IsOptional()
    @IsDateString()
    productionStartDate?: Date;
    
}
