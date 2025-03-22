import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './Repositories/category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, AssetRepository],
  exports:[CategoryRepository],
})
export class CategoryModule {}
