import { Controller, Post, Body, Get, UploadedFile, UseInterceptors, Param, UploadedFiles } from '@nestjs/common';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { CreateFileDto } from './types/dto/create-file.dto';  
import { File } from './entities/file.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Uploads Resource')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

 @Post()
  @UseInterceptors(FileInterceptor('file'))  
  @ApiConsumes('multipart/form-data') 
  @ApiBody({
    description: 'Upload a file',
    type: CreateFileDto,
  })
    @ApiOperation({ summary: 'Upload a file' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {

    return this.uploadsService.createFile(file);
  }

  /*@Post()
  @UseInterceptors(FilesInterceptor('files', 10)) 
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload multiple files',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload multiple files' })
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadsService.createFiles(files);
  }
*/
  @Get("files")
  @ApiOperation({ summary: 'Get all uploaded files' })
  @ApiResponse({
    status: 200,
    description: 'List of all uploaded files',
    type: [File],
  })
  async getAllFiles() {
    return await this.uploadsService.GetAllFiles();
  }
  

  @Get('file/:id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiResponse({ status: 200, type: File })
  async getFileById(@Param('id') id: string) {
    return this.uploadsService.getFileById(id);
  }
  

  

}
