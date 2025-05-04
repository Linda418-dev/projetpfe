import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './Repositories/category.repository';
import { CreateCategoryDto } from './types/dto/create-category.dto';
import { UpdateCategoryDto } from './types/dto/update-category.dto';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository : CategoryRepository,
        private readonly assetRepository : AssetRepository
     ){}
  //  methode pour get All categories
    async getAllCategories() {
        return this.categoryRepository.find({
            relations: ['assets'], 
        });
    }
    // methode pour get Category By id 
    async getCategoryById(id: string) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['assets'], 
        });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }
  //  methode pour creation category
    async createCategory(createCategoryDto: CreateCategoryDto) {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }
  //  methode pour modifier le category
    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
        const fetchCategory = await this.categoryRepository.findOne({
          where: { id },
          relations: ['assets'], 
        });
      
        if (!fetchCategory) {
          throw new BadRequestException(`Category with id ${id} not found`);
        }
        Object.assign(fetchCategory, updateCategoryDto);
        const updatedCategory = await this.categoryRepository.save(fetchCategory);
        const updatedAssets = await this.assetRepository.find({
          where: { category: updatedCategory },
        });
      
        return {
          message: 'Category updated successfully',
          category: updatedCategory,
          assets: updatedAssets,
        };
      }
    // methode pour supprimer category 
    async deleteCategory(id: string) {
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0){
          throw new NotFoundException('Category not found')
        } 
        return { message: 'Category deleted successfully' };
    }
}
