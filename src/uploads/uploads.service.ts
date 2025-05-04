import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { File } from './entities/file.entity';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>) {}

  async createFile(file: Express.Multer.File) {
    const newFile = this.fileRepository.create({
      name: file.originalname,
     urlFile: `uploads/${file.filename}`,
      //urlFile: file.originalname,

      typeFile: file.mimetype,
    });

    const savedFile  = await this.fileRepository.save(newFile);
    return {
      message: 'File uploaded successfully',
      fileId: savedFile.id,
      urlFile: savedFile.urlFile,
      typeFile: savedFile.typeFile,
    };
  }


  async createFiles(files: Express.Multer.File[]) {
    const newFiles = files.map(file => this.fileRepository.create({
      name: file.originalname,
      urlFile: file.originalname, 
      typeFile: file.mimetype,
    }));
  
    const savedFiles = await this.fileRepository.save(newFiles);
  
    return {
      message: 'Files uploaded successfully',
      fileIds: savedFiles.map(file => file.id),
    };
  }

  async GetAllFiles() {
    const files = await this.fileRepository.find();
    return files.map(file => ({ id: file.id, name: file.name }));
  }


  async getFileById(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }
  

}
