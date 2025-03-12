import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    description: 'L\'ID de l\'asset auquel le fichier est associé',
    type: String,
  })
  @IsUUID() // Valide que l'assetId est un UUID valide
  @IsNotEmpty() // Vérifie que l'assetId n'est pas vide
  assetId: string;

  @ApiProperty({
    description: 'Le fichier à uploader',
    type: 'string',
    format: 'binary', // Swagger attend ce format pour afficher le bouton de fichier
  })
  file: any;
}
