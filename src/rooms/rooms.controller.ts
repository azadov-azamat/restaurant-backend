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
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { UpdateElementsDto } from "./dto/update-elements.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@Controller("rooms")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get()
  findAll(floorId?: string) {
    return this.roomsService.findAll(floorId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param("id") id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @Patch(":id/elements")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  updateElements(@Param("id") id: string, @Body() dto: UpdateElementsDto) {
    return this.roomsService.updateElements(id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param("id") id: string) {
    return this.roomsService.remove(id);
  }
}
