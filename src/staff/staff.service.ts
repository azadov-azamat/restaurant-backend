import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateStaffDto } from "./dto/create-staff.dto"
import type { UpdateStaffDto } from "./dto/update-staff.dto"
import * as bcrypt from "bcrypt"
import type { UserRole } from "@prisma/client"

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        photo: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        photo: true,
        phone: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException("Staff not found")
    }

    return user
  }

  async create(dto: CreateStaffDto, allowedRoles?: UserRole[]) {
    // Check if role is allowed
    if (allowedRoles && !allowedRoles.includes(dto.role)) {
      throw new BadRequestException(`Cannot create staff with role ${dto.role}`)
    }

    // Check if username exists
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    })

    if (existing) {
      throw new BadRequestException("Username already exists")
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        photo: true,
        phone: true,
        createdAt: true,
      },
    })
  }

  async update(id: string, dto: UpdateStaffDto) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundException("Staff not found")
    }

    const data: any = { ...dto }

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10)
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        photo: true,
        phone: true,
        createdAt: true,
      },
    })
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundException("Staff not found")
    }

    await this.prisma.user.delete({ where: { id } })
    return { message: "Staff deleted successfully" }
  }
}
