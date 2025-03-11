import { Body, Controller, Post } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './types/dto/CreateFile.dto';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService){}

    @Post() 
    async CreateFile(@Body() createFileDto: CreateFileDto){
        return this.fileService.createFile(createFileDto);
    }
}
