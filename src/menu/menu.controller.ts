import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { UserRole } from "@prisma/client"
import type { MenuService } from "./menu.service"
import type { CreateMenuItemDto } from "./dto/create-menu-item.dto"
import type { UpdateMenuItemDto } from "./dto/update-menu-item.dto"
import { Roles } from "../common/decorators/roles.decorator"
import { RolesGuard } from "../common/guards/roles.guard"

@Controller("menu")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  findAll(categoryId?: string, inStock?: string) {
    return this.menuService.findAll(categoryId, inStock !== undefined ? inStock === "true" : undefined)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.update(id, dto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
