import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateFloorDto } from "./dto/create-floor.dto";
import type { UpdateFloorDto } from "./dto/update-floor.dto";

@Injectable()
export class FloorsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.floor.findMany({
      include: { rooms: true },
      orderBy: { level: "asc" },
    });
  }

  async findOne(id: string) {
    const floor = await this.prisma.floor.findUnique({
      where: { id },
      include: { rooms: true },
    });

    if (!floor) {
      throw new NotFoundException("Floor not found");
    }

    return floor;
  }

  create(dto: CreateFloorDto) {
    return this.prisma.floor.create({ data: dto });
  }

  async update(id: string, dto: UpdateFloorDto) {
    await this.findOne(id);
    return this.prisma.floor.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.floor.delete({ where: { id } });
    return { message: "Floor deleted successfully" };
  }
}
