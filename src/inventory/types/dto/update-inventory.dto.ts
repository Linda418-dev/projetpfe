import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class UpdateInventoryDto {
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    closingDate?: string; 
  }