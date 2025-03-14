import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './types/dto/create-category.dto';
import { UpdateCategoryDto } from './types/dto/update-category.dto';

@Controller('category')
export class CategoryController {
     constructor(private readonly categoryService: CategoryService) {}
      
     @Get()
     getAllCategories() {
         return this.categoryService.getAllCategories();
     }
 
     @Get(':id')
     getCategoryById(@Param('id') id: string) {
         return this.categoryService.getCategoryById(id);
     }
 
     @Post()
     createCategory(@Body() createCategoryDto: CreateCategoryDto) {
         return this.categoryService.createCategory(createCategoryDto);
     }
 
     @Patch(':id')
    async updateCategory(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
        }
 
     @Delete(':id')
     deleteCategory(@Param('id') id: string) {
         return this.categoryService.deleteCategory(id);
     }
}
