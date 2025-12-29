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
import type { StaffService } from "./staff.service";
import type { CreateStaffDto } from "./dto/create-staff.dto";
import type { UpdateStaffDto } from "./dto/update-staff.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("staff")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get()
  findAll(role?: UserRole) {
    return this.staffService.findAll(role);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.staffService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() dto: CreateStaffDto, @CurrentUser() user: any) {
    // Manager can only create WAITER and CHEF
    const allowedRoles =
      user.role === UserRole.MANAGER
        ? [UserRole.WAITER, UserRole.CHEF]
        : undefined;

    return this.staffService.create(dto, allowedRoles);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param("id") id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.update(id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  remove(@Param("id") id: string) {
    return this.staffService.remove(id);
  }
}
