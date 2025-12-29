"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
let StaffService = class StaffService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(role) {
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
        });
    }
    async findOne(id) {
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
        });
        if (!user) {
            throw new common_1.NotFoundException("Staff not found");
        }
        return user;
    }
    async create(dto, allowedRoles) {
        if (allowedRoles && !allowedRoles.includes(dto.role)) {
            throw new common_1.BadRequestException(`Cannot create staff with role ${dto.role}`);
        }
        const existing = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });
        if (existing) {
            throw new common_1.BadRequestException("Username already exists");
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
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
        });
    }
    async update(id, dto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException("Staff not found");
        }
        const data = { ...dto };
        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 10);
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
        });
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException("Staff not found");
        }
        await this.prisma.user.delete({ where: { id } });
        return { message: "Staff deleted successfully" };
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], StaffService);
//# sourceMappingURL=staff.service.js.map