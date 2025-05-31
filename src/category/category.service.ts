import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './Repositories/category.repository';
import { CreateCategoryDto } from './types/dto/create-category.dto';
import { UpdateCategoryDto } from './types/dto/update-category.dto';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { SiteRepository } from 'src/site/Repositories/site.repository';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository : CategoryRepository,
        private readonly assetRepository : AssetRepository,
        private readonly  siteRepository : SiteRepository
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
  const { name, siteId } = createCategoryDto;

  const site = await this.siteRepository.findOneBy({ id: siteId });
  if (!site) {
    throw new NotFoundException(`Site with ID ${siteId} not found`);
  }

  // Vérifier l’unicité du nom de catégorie pour ce site
  const existingCategory = await this.categoryRepository.findOne({
    where: { name, site: { id: siteId } },
    relations: ['site'],
  });

  if (existingCategory) {
    throw new BadRequestException(
      `A category named '${name}' already exists in this site`
    );
  }

  const category = this.categoryRepository.create({
    name,
    site,
  });

  return this.categoryRepository.save(category);
}



   async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
  const fetchCategory = await this.categoryRepository.findOne({
    where: { id },
    relations: ['assets', 'site'],
  });

  if (!fetchCategory) {
    throw new BadRequestException(`Category with id ${id} not found`);
  }

  const { name, siteId } = updateCategoryDto;

  // Si un nouveau site est fourni, le charger
  if (siteId && siteId !== (fetchCategory.site as any).id) {
    const newSite = await this.siteRepository.findOneBy({ id: siteId });
    if (!newSite) {
      throw new NotFoundException(`Site with ID ${siteId} not found`);
    }
    fetchCategory.site = newSite;
  }

  // Vérifier si un doublon de nom dans le même site existe (sauf si le nom est identique à l’actuel)
  if (name) {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name,
        site: { id: siteId ?? (fetchCategory.site as any).id },
      },
      relations: ['site'],
    });

    if (existingCategory && existingCategory.id !== id) {
      throw new BadRequestException(
        `Another category named '${name}' already exists in this site`
      );
    }

    fetchCategory.name = name;
  }

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
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['assets'],
      });
    
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    
      if (category.assets.length > 0) {
        throw new BadRequestException('Cannot delete category, it is associated with assets');
      }
    
      await this.categoryRepository.remove(category);
      return { message: 'Category deleted successfully' };
    }


   async getCategoriesBySite(siteId: string) {
    return this.categoryRepository.find({
      where: { site: { id: siteId } },
      relations: ['site'],
    });
  }




}
