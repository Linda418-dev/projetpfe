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
    // Chercher la catégorie et charger la relation assets
    let category = await this.categoryRepository.findOne({ where: { name: categoryName }, relations: ['assets'] });

    if (!category || !category.id) {
        throw new Error('Category not found or invalid category ID');
    }

    // Chercher le fournisseur et charger la relation assets
    let supplier = await this.supplierRepository.findOne({ where: { name: supplierName }, relations: ['assets'] });
    if (!supplier || !supplier.id) {
        throw new Error('Supplier not found or invalid supplier ID');
    }

    // Créer l'asset
    const asset = new Asset();
    asset.name = assetName;
    asset.category = category;  // Assurez-vous que category est bien l'objet complet
    asset.categoryName = category.name;
    asset.supplier = supplier;
    asset.supplierName = supplier.name;

    // Sauvegarder l'asset
    await this.assetRepository.save(asset);

    // Chercher le fichier à associer
    const file = await this.fileRepository.findOne({ where: { id: fileId } });
    if (!file) {
        throw new Error('File not found');
    }

    file.asset = asset;
    file.assetId = asset.id;
    asset.imageUrl = file.urlFile;

    await this.fileRepository.save(file);
    await this.assetRepository.save(asset);

    const categoryAssetNames = category.assets.map(a => a.name); 
    categoryAssetNames.push(asset.name); 
    category.assetsNames = categoryAssetNames.join(', '); 
    await this.categoryRepository.save(category); 

    const supplierAssetNames = supplier.assets.map(a => a.name); 
    supplierAssetNames.push(asset.name); 
    supplier.assetsNames = supplierAssetNames.join(', '); 
    await this.supplierRepository.save(supplier); 

    return asset;
}




}
