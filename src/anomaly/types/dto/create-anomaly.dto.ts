import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum,  IsOptional, IsString, IsUUID } from "class-validator";
import { AnomalySeverity } from "../enums/anomaly-severity.enum";

export class CreateAnomalyDto {
    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true }) 
    fileIds?: string[];

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    assetId?: string;

    @ApiPropertyOptional({
    enum: AnomalySeverity,
    default: AnomalySeverity.MEDIUM,
    description: 'Niveau de gravité',
  })
  @IsOptional()
  @IsEnum(AnomalySeverity)
  severity?: AnomalySeverity;
    
}
