import { BadRequestException, Injectable } from '@nestjs/common';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { CreateFileDto } from './types/dto/CreateFile.dto';
import { FileRepository } from './Repositories/File.repository';


@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly assetRepository: AssetRepository,
  ) {}

  async createFile(createFileDto: CreateFileDto) {
    const { assetId, filename } = createFileDto;

    const asset = await this.assetRepository.findOne({ where: { id: assetId } });

    if (!asset) {
      throw new BadRequestException('Asset not found');
    }
    const file = this.fileRepository.create({
      filename,
      asset, 
    });

    await this.fileRepository.save(file);
    return file;
  }
}
