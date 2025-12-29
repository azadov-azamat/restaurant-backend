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
exports.FloorsService = void 0;
const common_1 = require("@nestjs/common");
let FloorsService = class FloorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.floor.findMany({
            include: { rooms: true },
            orderBy: { level: "asc" },
        });
    }
    async findOne(id) {
        const floor = await this.prisma.floor.findUnique({
            where: { id },
            include: { rooms: true },
        });
        if (!floor) {
            throw new common_1.NotFoundException("Floor not found");
        }
        return floor;
    }
    create(dto) {
        return this.prisma.floor.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.floor.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.floor.delete({ where: { id } });
        return { message: "Floor deleted successfully" };
    }
};
exports.FloorsService = FloorsService;
exports.FloorsService = FloorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], FloorsService);
//# sourceMappingURL=floors.service.js.map