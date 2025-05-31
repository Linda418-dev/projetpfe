import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './Repositories/category.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, AssetRepository,SiteRepository],
  exports:[CategoryRepository],
})
export class CategoryModule {}
