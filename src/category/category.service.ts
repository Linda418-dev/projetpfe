import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './Repositories/category.repository';
import { CreateCategoryDto } from './types/dto/create-category.dto';
import { UpdateCategoryDto } from './types/dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository : CategoryRepository ){}
   
    async getAllCategories() {
        return this.categoryRepository.find({
            relations: ['assets'], // Charger les assets associés
        });
    }
    

    async getCategoryById(id: string) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['assets'], 
        });
        if (!category) throw new NotFoundException('Catégorie non trouvée');
        return category;
    }
    async getAllCategoryNames() {
        const categories = await this.categoryRepository.find({ select: ['name'] });
        return categories.map(category => category.name);
      }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    async updateCategory(id: string, updatecategoryDto: UpdateCategoryDto) {
        const fetchCategory = await this.getCategoryById(id);
        if (!fetchCategory) {
            throw new BadRequestException(`Category with id ${id} not found`);
        }
        Object.assign(fetchCategory, updatecategoryDto);
        return this.categoryRepository.save(fetchCategory);
    }

    async deleteCategory(id: string) {
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Catégorie non trouvée');
    }
}
