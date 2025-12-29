import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { menuItems: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { menuItems: true },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { menuItems: true } } },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (category._count.menuItems > 0) {
      throw new BadRequestException("Cannot delete category with menu items");
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: "Category deleted successfully" };
  }
}
