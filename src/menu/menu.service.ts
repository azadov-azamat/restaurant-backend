import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import type { UpdateMenuItemDto } from "./dto/update-menu-item.dto";

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  findAll(categoryId?: string, inStock?: boolean) {
    return this.prisma.menuItem.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(inStock !== undefined && { inStock }),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) {
      throw new NotFoundException("Menu item not found");
    }

    return item;
  }

  create(dto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({
      data: dto,
      include: { category: true },
    });
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    await this.findOne(id);
    return this.prisma.menuItem.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.menuItem.delete({ where: { id } });
    return { message: "Menu item deleted successfully" };
  }
}
