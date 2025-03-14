import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Asset } from "src/assets/Entities/Asset.entity";
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
    return files;
  }
  async createAssetAndAssignToFile(assetName: string, fileId: string) {
    // Créer un nouvel asset
    const asset = this.assetRepository.create({
      name: assetName,
    });
  
    // Sauvegarder l'asset
    await this.assetRepository.save(asset);
  
    // Chercher le fichier par son ID
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });
  
    if (!file) {
      throw new Error('File not found');
    }
  
    // Assigner l'asset au fichier
    file.asset = asset;
  
    // Assigner l'ID de l'asset à la colonne assetId du fichier
    file.assetId = asset.id;  // Assurez-vous que la colonne assetId est bien présente dans la table file
    
    // Mettre à jour l'URL de l'image dans l'asset
    asset.imageUrl = file.urlFile;
  
    await this.fileRepository.save(file);
  
    await this.assetRepository.save(asset);
  
    return asset;
  }
  
}
