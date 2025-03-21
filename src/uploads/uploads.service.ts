import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Asset } from 'src/assets/Entities/Asset.entity';
import { Repository } from "typeorm";
import { File } from './entities/file.entity';
import { Category } from "src/category/Entities/category.entity";
import { Supplier } from "src/supplier/Entities/Supplier.entity";
import { Place } from "src/places/Entities/Place.entity";
import { AssignFileToAssetDto } from "./types/dto/assign-file.dto";

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
    @InjectRepository(Place) private placeRepository: Repository<Place>,




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




}
