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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    constructor(prisma, wsGateway) {
        this.prisma = prisma;
        this.wsGateway = wsGateway;
    }
    async findAll(userId, userRole, status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        if (userRole === client_1.UserRole.WAITER) {
            where.waiterId = userId;
        }
        if (userRole === client_1.UserRole.CHEF) {
            where.items = {
                some: {
                    status: {
                        in: [client_1.OrderItemStatus.SENT, client_1.OrderItemStatus.PREPARING],
                    },
                },
            };
        }
        return this.prisma.order.findMany({
            where,
            include: {
                room: { include: { floor: true } },
                table: true,
                waiter: { select: { id: true, name: true } },
                items: {
                    include: { menuItem: { include: { category: true } } },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                room: { include: { floor: true } },
                table: true,
                waiter: { select: { id: true, name: true } },
                items: {
                    include: { menuItem: { include: { category: true } } },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException("Order not found");
        }
        return order;
    }
    async create(dto, waiterId) {
        const order = await this.prisma.order.create({
            data: {
                roomId: dto.roomId,
                tableId: dto.tableId,
                waiterId,
                note: dto.note,
            },
            include: {
                room: { include: { floor: true } },
                table: true,
                waiter: { select: { id: true, name: true } },
                items: true,
            },
        });
        this.wsGateway.emitOrderCreated(order);
        return order;
    }
    async addItems(orderId, dto) {
        const order = await this.findOne(orderId);
        if (order.status === client_1.OrderStatus.PAID ||
            order.status === client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException("Cannot modify closed order");
        }
        const menuItems = await this.prisma.menuItem.findMany({
            where: { id: { in: dto.items.map((i) => i.menuItemId) } },
        });
        const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));
        for (const item of dto.items) {
            const menuItem = menuItemMap.get(item.menuItemId);
            if (!menuItem)
                continue;
            await this.prisma.orderItem.create({
                data: {
                    orderId,
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    price: menuItem.price,
                    note: item.note,
                    status: client_1.OrderItemStatus.PENDING,
                },
            });
        }
        const updatedOrder = await this.recalculateTotal(orderId);
        this.wsGateway.emitOrderUpdated(updatedOrder);
        return updatedOrder;
    }
    async updateItemStatus(orderId, itemId, status) {
        const order = await this.findOne(orderId);
        const item = order.items.find((i) => i.id === itemId);
        if (!item) {
            throw new common_1.NotFoundException("Order item not found");
        }
        await this.prisma.orderItem.update({
            where: { id: itemId },
            data: { status },
        });
        const updatedOrder = await this.findOne(orderId);
        if (status === client_1.OrderItemStatus.SENT) {
            this.wsGateway.emitKitchenNew(updatedOrder, item);
        }
        else if (status === client_1.OrderItemStatus.READY) {
            this.wsGateway.emitKitchenReady(updatedOrder, item);
        }
        this.wsGateway.emitItemStatusChanged(updatedOrder, itemId, status);
        return updatedOrder;
    }
    async sendToKitchen(orderId) {
        const order = await this.findOne(orderId);
        const pendingItems = order.items.filter((i) => i.status === client_1.OrderItemStatus.PENDING && i.menuItem.requiresKitchen);
        if (pendingItems.length === 0) {
            throw new common_1.BadRequestException("No pending items to send to kitchen");
        }
        await this.prisma.orderItem.updateMany({
            where: {
                id: { in: pendingItems.map((i) => i.id) },
            },
            data: { status: client_1.OrderItemStatus.SENT },
        });
        const nonKitchenItems = order.items.filter((i) => i.status === client_1.OrderItemStatus.PENDING && !i.menuItem.requiresKitchen);
        if (nonKitchenItems.length > 0) {
            await this.prisma.orderItem.updateMany({
                where: {
                    id: { in: nonKitchenItems.map((i) => i.id) },
                },
                data: { status: client_1.OrderItemStatus.READY },
            });
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: client_1.OrderStatus.SENT },
        });
        const updatedOrder = await this.findOne(orderId);
        this.wsGateway.emitOrderUpdated(updatedOrder);
        this.wsGateway.emitKitchenNew(updatedOrder, null);
        return updatedOrder;
    }
    async markPaid(orderId) {
        const order = await this.findOne(orderId);
        const undelivered = order.items.filter((i) => i.status !== client_1.OrderItemStatus.DELIVERED);
        if (undelivered.length > 0) {
            throw new common_1.BadRequestException("All items must be delivered before payment");
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: client_1.OrderStatus.PAID,
                paidAt: new Date(),
            },
        });
        const updatedOrder = await this.findOne(orderId);
        this.wsGateway.emitOrderUpdated(updatedOrder);
        return updatedOrder;
    }
    async cancel(orderId) {
        await this.findOne(orderId);
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: client_1.OrderStatus.CANCELLED },
        });
        const updatedOrder = await this.findOne(orderId);
        this.wsGateway.emitOrderUpdated(updatedOrder);
        return updatedOrder;
    }
    async recalculateTotal(orderId) {
        const items = await this.prisma.orderItem.findMany({
            where: { orderId },
        });
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await this.prisma.order.update({
            where: { id: orderId },
            data: { total },
        });
        return this.findOne(orderId);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Function])
], OrdersService);
//# sourceMappingURL=orders.service.js.map