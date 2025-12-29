import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { UserRole } from "@prisma/client"
import type { FloorsService } from "./floors.service"
import type { CreateFloorDto } from "./dto/create-floor.dto"
import type { UpdateFloorDto } from "./dto/update-floor.dto"
import { Roles } from "../common/decorators/roles.decorator"
import { RolesGuard } from "../common/guards/roles.guard"

@Controller("floors")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class FloorsController {
  constructor(private floorsService: FloorsService) {}

  @Get()
  findAll() {
    return this.floorsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.floorsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() dto: CreateFloorDto) {
    return this.floorsService.create(dto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateFloorDto) {
    return this.floorsService.update(id, dto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.floorsService.remove(id);
  }
}
