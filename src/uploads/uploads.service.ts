import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Asset } from 'src/assets/Entities/Asset.entity';
import { Repository } from "typeorm";
import { File } from './entities/file.entity';
import { Category } from "src/category/Entities/category.entity";

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>

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
  async GetAllNameFiles() {
    const files = await this.fileRepository.find();
    return files.map(file => ({ name: file.name }));
  }
  
  async createAssetAndAssignToFile(assetName: string, categoryName: string, fileId: string) {
    let category = await this.categoryRepository.findOne({ where: { name: categoryName } });

    if (!category) {
        throw new Error('Category not found');
    }

    const asset = new Asset();
    asset.name = assetName;
    asset.category = category;
    asset.categoryName = category.name;

    await this.assetRepository.save(asset);

    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
        throw new Error('File not found');
    }

    file.asset = asset;
    file.assetId = asset.id;
    asset.imageUrl = file.urlFile;

    await this.fileRepository.save(file);
    await this.assetRepository.save(asset);

    const assetNames = category.assets ? category.assets.map(a => a.name) : [];
    assetNames.push(asset.name); 
    category.assetsNames = assetNames.join(', '); 
    await this.categoryRepository.save(category);

    return asset;
  }
}
