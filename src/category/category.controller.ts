import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './types/dto/create-category.dto';
import { UpdateCategoryDto } from './types/dto/update-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiBearerAuth()
@ApiTags('Category Resource')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
      
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'get all categories' })
    getAllCategories() {
        return this.categoryService.getAllCategories();
     }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'create category' })
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'get category by id' })
    getCategoryById(@Param('id') id: string) {
        return this.categoryService.getCategoryById(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'edit category' })
    async updateCategory(@Param('id', new ParseUUIDPipe()) id: string,@Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.updateCategory(id, updateCategoryDto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'delete category' })
    deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }

    @Get('site/:siteId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superAdmin','operator')
    @ApiOperation({ summary: 'Get categories by site ID' })
    getCategoriesBySite(@Param('siteId') siteId: string) {
        return this.categoryService.getCategoriesBySite(siteId);
    }

}
