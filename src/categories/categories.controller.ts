import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserRole } from "@prisma/client";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags("Categories")
@ApiBearerAuth("JWT-auth")
@Controller("categories")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 200, description: "List of categories" })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get category by ID" })
  @ApiParam({ name: "id", description: "Category ID" })
  @ApiResponse({ status: 200, description: "Category found" })
  @ApiResponse({ status: 404, description: "Category not found" })
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Create category (Admin/Manager only)" })
  @ApiResponse({ status: 201, description: "Category created" })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update category (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Category ID" })
  @ApiResponse({ status: 200, description: "Category updated" })
  update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Delete category (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Category ID" })
  @ApiResponse({ status: 200, description: "Category deleted" })
  @ApiResponse({
    status: 400,
    description: "Cannot delete category with menu items",
  })
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
