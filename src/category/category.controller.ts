import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './types/dto/create-category.dto';
import { UpdateCategoryDto } from './types/dto/update-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Category Resource')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
      
    @Get()
    @ApiOperation({ summary: 'get all categories' })
    getAllCategories() {
        return this.categoryService.getAllCategories();
     }

    @Post()
    @ApiOperation({ summary: 'create category' })
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'get category by id' })
    getCategoryById(@Param('id') id: string) {
        return this.categoryService.getCategoryById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'edit category' })
    async updateCategory(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.updateCategory(id, updateCategoryDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'delete category' })
    deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }
}
