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
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { UpdateElementsDto } from "./dto/update-elements.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags("Rooms")
@ApiBearerAuth("JWT-auth")
@Controller("rooms")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: "Get all rooms" })
  @ApiQuery({
    name: "floorId",
    required: false,
    description: "Filter by floor ID",
  })
  @ApiResponse({ status: 200, description: "List of rooms" })
  findAll(@Query("floorId") floorId?: string) {
    return this.roomsService.findAll(floorId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get room with elements" })
  @ApiParam({ name: "id", description: "Room ID" })
  @ApiResponse({ status: 200, description: "Room found with layout" })
  findOne(@Param("id") id: string) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Create room (Admin/Manager only)" })
  @ApiResponse({ status: 201, description: "Room created" })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update room (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Room ID" })
  @ApiResponse({ status: 200, description: "Room updated" })
  update(@Param("id") id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @Patch(":id/elements")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Update room layout (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Room ID" })
  @ApiResponse({ status: 200, description: "Room layout updated" })
  updateElements(@Param("id") id: string, @Body() dto: UpdateElementsDto) {
    return this.roomsService.updateElements(id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Delete room (Admin/Manager only)" })
  @ApiParam({ name: "id", description: "Room ID" })
  @ApiResponse({ status: 200, description: "Room deleted" })
  remove(@Param("id") id: string) {
    return this.roomsService.remove(id);
  }
}
