import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { FileRepository } from './repositories/file-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from 'src/assets/Entities/Asset.entity';
import {File} from './entities/file.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([File, Asset]), // Assurez-vous que File et Asset sont dans forFeature
  ],
  providers: [UploadsService, FileRepository],
  controllers: [UploadsController]
})
export class UploadsModule {}
