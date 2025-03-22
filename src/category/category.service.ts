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
   
    async getAllCategories() {
        return this.categoryRepository.find({
            relations: ['assets'], 
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
    async createCategory(createCategoryDto: CreateCategoryDto) {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    async updateCategory(id: string, updatecategoryDto: UpdateCategoryDto) {
        const fetchCategory = await this.getCategoryById(id);
        if (!fetchCategory) {
            throw new BadRequestException(`Category with id ${id} not found`);
        }
    
        // 🔹 Sauvegarder l'ancien nom de la catégorie
        const oldCategoryName = fetchCategory.name;
    
        // 🔄 Mettre à jour le nom de la catégorie
        Object.assign(fetchCategory, updatecategoryDto);
        await this.categoryRepository.save(fetchCategory);
    
        // 🔹 Vérifier si le nom a changé
        if (updatecategoryDto.name && updatecategoryDto.name !== oldCategoryName) {
            // 🔄 Mettre à jour tous les assets liés à cette catégorie
            await this.assetRepository.update(
                { category: fetchCategory },  // Condition : Assets liés à cette catégorie
                { categoryName: updatecategoryDto.name } // Nouveau nom
            );
        }
    
        return fetchCategory;
    }
    

    async deleteCategory(id: string) {
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Catégorie non trouvée');
    }
}
