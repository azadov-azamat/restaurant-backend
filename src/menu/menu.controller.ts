import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
  ApiQuery,
} from "@nestjs/swagger";
import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags("Menu")
@ApiBearerAuth("JWT-auth")
@Controller("menu")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: "Get all menu items" })
  @ApiQuery({
    name: "categoryId",
    required: false,
    description: "Filter by category ID",
  })
  @ApiQuery({
    name: "inStock",
    required: false,
    type: Boolean,
    description: "Filter by stock availability",
  })
  @ApiResponse({
    status: 200,
    description: "List of menu items",
  })
  findAll(
    @Query("categoryId") categoryId?: string,
    @Query("inStock") inStock?: string,
  ) {
    return this.menuService.findAll(
      categoryId,
      inStock !== undefined ? inStock === "true" : undefined,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get menu item by ID" })
  @ApiParam({ name: "id", description: "Menu item ID" })
  @ApiResponse({
    status: 200,
    description: "Menu item found",
  })
  @ApiResponse({
    status: 404,
    description: "Menu item not found",
  })
  findOne(@Param("id") id: string) {
    return this.menuService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Create menu item (Admin/Manager only)" })
  @ApiResponse({
    status: 201,
    description: "Menu item created successfully",
  })
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update menu item (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Menu item ID" })
  @ApiResponse({
    status: 200,
    description: "Menu item updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Menu item not found",
  })
  update(@Param("id") id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.update(id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Delete menu item (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Menu item ID" })
  @ApiResponse({
    status: 200,
    description: "Menu item deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Menu item not found",
  })
  remove(@Param("id") id: string) {
    return this.menuService.remove(id);
  }
}
