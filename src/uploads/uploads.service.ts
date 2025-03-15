import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Asset } from 'src/assets/Entities/Asset';
import { Repository } from "typeorm";
import { File } from './entities/file.entity';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>
  ) {}

  async createFile(file: Express.Multer.File) {
    const newFile = this.fileRepository.create({
      name: file.originalname,
      urlFile: `/uploads/${file.filename}`,
      typeFile: file.mimetype,
    });

    return this.fileRepository.save(newFile);
  }

  async GetAllFiles() {
    const files = await this.fileRepository.find();
    return files.map(file => ({ id: file.id, name: file.name }));
  }
  async createAssetAndAssignToFile(assetName: string, fileId: string) {
    const asset = this.assetRepository.create({
      name: assetName,
    });
  
    await this.assetRepository.save(asset);
  
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });
  
    if (!file) {
      throw new Error('File not found');
    }
  
    file.asset = asset;
  
    file.assetId = asset.id; 
    
    asset.imageUrl = file.urlFile;
  
    await this.fileRepository.save(file);
  
    await this.assetRepository.save(asset);
  
    return asset;
  }
  
}
