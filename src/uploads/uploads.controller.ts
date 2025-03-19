import { Controller, Post, Body, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { CreateFileDto } from './types/dto/create-file.dto';  
import { AssignFileToAssetDto } from './types/dto/assign-file.dto';
import { File } from './entities/file.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Uploads Resource')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))  
  @ApiConsumes('multipart/form-data')  
  @ApiOperation({ summary: 'Upload a file' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.createFile(file);
  }

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
  

 /*@Post('create-asset-and-assign-file')
  @ApiOperation({ summary: 'Create an asset, assign it to a category and a file' })
  async createAssetAndAssignToFile(@Body() assignFileToAssetDto: AssignFileToAssetDto) {
  const { assetName, categoryName, supplierName, fileId, locationName } = assignFileToAssetDto;
  const asset = await this.uploadsService.createAssetAndAssignToFile(assignFileToAssetDto);
  return {
    message: 'Asset successfully created and assigned to file, category, and location',
    asset,
  };
}*/

  

}
