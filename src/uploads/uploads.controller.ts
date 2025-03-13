import { Controller, Post, UseInterceptors, UploadedFile, Body, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { CreateFileDto } from './types/dto/create-file.dto';  

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
  @ApiOperation({ summary: 'Upload a file ' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadsService.createFile(file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all uploaded files' })
  @ApiResponse({
    status: 200,
    description: 'List of all uploaded files',
    type: [File],  
  })
  async getAllFiles(){
    return await this.uploadsService.GetAllFiles();
  }

}
