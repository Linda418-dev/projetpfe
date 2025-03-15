import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',  
    description: 'The file to upload',
  })
  file: any; 
}
