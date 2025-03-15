import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetRepository } from './Repositories/Asset.repository';
import { AssetsService } from './asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsModule } from 'src/uploads/uploads.module';
import { Asset } from './Entities/Asset';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { UploadsService } from 'src/uploads/uploads.service';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { CategoryService } from 'src/category/category.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),  
    UploadsModule
    
  ],
  controllers: [AssetController],
  providers: [AssetsService, AssetRepository , FileRepository , CategoryRepository, CategoryService],
  exports: [AssetsService, AssetRepository], 
})
export class AssetModule {}
