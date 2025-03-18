import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Asset } from 'src/assets/Entities/Asset.entity';
import { Repository } from "typeorm";
import { File } from './entities/file.entity';
import { Category } from "src/category/Entities/category.entity";
import { Supplier } from "src/supplier/Entities/Supplier.entity";
import { Place } from "src/places/Entities/Place.entity";
import { AssignFileToAssetDto } from "./types/dto/assign-file.dto";
import { HistoriqueLocationAsset } from "src/historique-location-asset/entities/historique-location-asset.entity";

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
    @InjectRepository(Place) private placeRepository: Repository<Place>,
    @InjectRepository(HistoriqueLocationAsset) private historiqueLocationAssetRepository: Repository<HistoriqueLocationAsset>,




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
  
  async createAssetAndAssignToFile(dto: AssignFileToAssetDto) {
    const { assetName, categoryName, supplierName, fileId, locationName } = dto;

    const category = await this.categoryRepository.findOne({ where: { name: categoryName }, relations: ['assets'] });
    if (!category) throw new Error('Category not found');

    const supplier = await this.supplierRepository.findOne({ where: { name: supplierName }, relations: ['assets'] });
    if (!supplier) throw new Error('Supplier not found');

    let place = await this.placeRepository.findOne({ where: { name: locationName }, relations: ['assets'] });
    if (!place) throw new Error('Place not found');

    const asset = new Asset();
    asset.name = assetName;
    asset.category = category;
    asset.categoryName = category.name;
    asset.supplier = supplier;
    asset.supplierName = supplier.name;
    asset.place = place;
    asset.locationName = place.name;

    await this.assetRepository.save(asset);

    const file = await this.fileRepository.findOne({ where: { id: fileId } });
    if (!file) throw new Error('File not found');

    file.asset = asset;
    file.assetId = asset.id;
    asset.imageUrl = file.urlFile;

    await this.fileRepository.save(file);
    await this.assetRepository.save(asset);

    place.assetsNames = [...(place.assetsNames || []), asset.name];
    await this.placeRepository.save(place);

    const historique = new HistoriqueLocationAsset();
    historique.asset = asset;
    historique.assetId = asset.id;
    historique.assetName = asset.name;
    historique.place = place;
    historique.locationId = place.id;
    historique.locationName = place.name;
    
    await this.historiqueLocationAssetRepository.save(historique);

    return asset;
}



}
