import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Asset } from 'src/assets/Entities/Asset.entity';
import { Repository } from "typeorm";
import { File } from './entities/file.entity';
import { Category } from "src/category/Entities/category.entity";
import { Supplier } from "src/supplier/Entities/Supplier.entity";

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>


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
  
  async createAssetAndAssignToFile(assetName: string, categoryName: string, supplierName: string, fileId: string) {
    let category = await this.categoryRepository.findOne({ where: { name: categoryName }, relations: ['assets'] });

    if (!category) {
        throw new Error('Category not found');
    }

    let supplier = await this.supplierRepository.findOne({ where: { name: supplierName }, relations: ['assets'] });

    if (!supplier) {
        throw new Error('Supplier not found');
    }

    const asset = new Asset();
    asset.name = assetName;
    asset.category = category;  
    asset.categoryName = category.name;
    asset.supplier = supplier;
    asset.supplierName = supplier.name;

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

    // 🔄 Mettre à jour `assetsNames` dans Category en tableau
    category = await this.categoryRepository.findOne({ where: { id: category.id }, relations: ['assets'] });

    if (!category) {
        throw new Error('Category not found after reloading');
    }
    
    category.assetsNames = Array.from(new Set(category.assets.map(a => a.name))); // Évite les doublons
    await this.categoryRepository.save(category);

    // 🔄 Mettre à jour `assetsNames` dans Supplier en tableau
    supplier = await this.supplierRepository.findOne({ where: { id: supplier.id }, relations: ['assets'] });

    if (!supplier) {
        throw new Error('Supplier not found after reloading');
    }
    
    supplier.assetsNames = Array.from(new Set(supplier.assets.map(a => a.name))); // Évite les doublons
    await this.supplierRepository.save(supplier);
    

    return asset;
}





}
