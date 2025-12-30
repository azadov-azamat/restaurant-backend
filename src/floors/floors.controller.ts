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
import { FloorsService } from "./floors.service";
import { CreateFloorDto } from "./dto/create-floor.dto";
import { UpdateFloorDto } from "./dto/update-floor.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags("Floors")
@ApiBearerAuth("JWT-auth")
@Controller("floors")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class FloorsController {
  constructor(private floorsService: FloorsService) {}

  @Get()
  @ApiOperation({ summary: "Get all floors" })
  @ApiResponse({ status: 200, description: "List of floors" })
  findAll() {
    return this.floorsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get floor by ID" })
  @ApiParam({ name: "id", description: "Floor ID" })
  @ApiResponse({ status: 200, description: "Floor found" })
  findOne(@Param("id") id: string) {
    return this.floorsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Create floor (Admin/Manager only)" })
  @ApiResponse({ status: 201, description: "Floor created" })
  create(@Body() dto: CreateFloorDto) {
    return this.floorsService.create(dto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update floor (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Floor ID" })
  @ApiResponse({ status: 200, description: "Floor updated" })
  update(@Param("id") id: string, @Body() dto: UpdateFloorDto) {
    return this.floorsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Delete floor (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Floor ID" })
  @ApiResponse({ status: 200, description: "Floor deleted" })
  remove(@Param("id") id: string) {
    return this.floorsService.remove(id);
  }
}
