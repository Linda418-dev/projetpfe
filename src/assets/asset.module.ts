import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetsService } from './asset.service';
import { AssetRepository } from './Repositories/Asset.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './Entities/Asset.entity';  
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),  
    UploadsModule
    
  ],
  controllers: [AssetController],
  providers: [AssetsService, AssetRepository],
  exports: [AssetsService, AssetRepository], 
})
export class AssetModule {}
