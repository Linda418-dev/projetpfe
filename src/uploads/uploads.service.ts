import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity'; // Assurez-vous que le chemin est correct

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async createFile(file: Express.Multer.File): Promise<File> {
    const newFile = this.fileRepository.create({
      name: file.originalname,
      urlFile: `/uploads/${file.filename}`,  // URL du fichier
      typeFile: file.mimetype,  // Type de fichier (mime type)
      assetId: null,  // L'assetId reste null au début
    });

    return this.fileRepository.save(newFile);
  }
}
