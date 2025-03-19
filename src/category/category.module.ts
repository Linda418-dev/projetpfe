import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './Repositories/category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports:[CategoryRepository],
})
export class CategoryModule {}
