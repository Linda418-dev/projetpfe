import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileRepository } from './Repositories/File.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';

@Module({
    controllers: [FileController],
    providers: [FileService , FileRepository , AssetRepository]
})
export class FileModule {}
