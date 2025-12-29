import { Injectable, NotFoundException } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";
import type { CreateRoomDto } from "./dto/create-room.dto";
import type { UpdateRoomDto } from "./dto/update-room.dto";
import type { UpdateElementsDto } from "./dto/update-elements.dto";

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  findAll(floorId?: string) {
    return this.prisma.room.findMany({
      where: floorId ? { floorId } : undefined,
      include: {
        floor: true,
        elements: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        floor: true,
        elements: true,
      },
    });

    if (!room) {
      throw new NotFoundException("Room not found");
    }

    return room;
  }

  create(dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: dto,
      include: { floor: true },
    });
  }

  async update(id: string, dto: UpdateRoomDto) {
    await this.findOne(id);
    return this.prisma.room.update({
      where: { id },
      data: dto,
      include: { floor: true },
    });
  }

  async updateElements(id: string, dto: UpdateElementsDto) {
    await this.findOne(id);

    // Delete existing elements and create new ones
    await this.prisma.roomElement.deleteMany({ where: { roomId: id } });

    if (dto.elements && dto.elements.length > 0) {
      await this.prisma.roomElement.createMany({
        data: dto.elements.map((el) => ({
          ...el,
          roomId: id,
        })),
      });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.room.delete({ where: { id } });
    return { message: "Room deleted successfully" };
  }
}
