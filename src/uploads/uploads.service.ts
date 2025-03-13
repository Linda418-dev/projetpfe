import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity'; 

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async createFile(file: Express.Multer.File): Promise<File> {
    const newFile = this.fileRepository.create({
      name: file.originalname,
      urlFile: `/uploads/${file.filename}`,  
      typeFile: file.mimetype, 
      assetId: null,  
    });

    return this.fileRepository.save(newFile);
  }

  async GetAllFiles(){
    return await this.fileRepository.find();
  }
}
