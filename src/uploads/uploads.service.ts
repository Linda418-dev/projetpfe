import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { Asset } from 'src/assets/Entities/Asset.entity';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async saveFileData(file: Express.Multer.File, assetId: string) {
    // Vérifier si l'asset existe
    const asset = await this.assetRepository.findOne({ where: { id: assetId } });
    if (!asset) {
      throw new Error('Asset non trouvé');
    }

    const fileEntity = new File();
    fileEntity.name = file.originalname; 
    fileEntity.urlFile = `/uploadsFiles/${file.filename}`; 
    fileEntity.typeFile = file.mimetype; 
    fileEntity.asset = asset; 

    try {
      return await this.fileRepository.save(fileEntity);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du fichier:', error);
      throw new Error('Échec de l\'enregistrement du fichier');
    }
  }
}
