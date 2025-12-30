import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AddItemsDto } from "./dto/add-items.dto";
import { OrderStatus, OrderItemStatus, UserRole } from "@prisma/client";
import { WebsocketGateway } from "../websocket/websocket.gateway";

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private wsGateway: WebsocketGateway,
  ) {}

  async findAll(userId: string, userRole: UserRole, status?: OrderStatus) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Waiter sees only their orders
    if (userRole === UserRole.WAITER) {
      where.waiterId = userId;
    }

    // Chef sees only orders with items in kitchen
    if (userRole === UserRole.CHEF) {
      where.items = {
        some: {
          status: {
            in: [OrderItemStatus.SENT, OrderItemStatus.PREPARING],
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
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        room: { include: { floor: true } },
        table: true,
        waiter: { select: { id: true, name: true } },
        items: {
          include: { menuItem: { include: { category: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async create(dto: CreateOrderDto, waiterId: string) {
    // Verify room and table exist
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${dto.roomId} not found`);
    }

    const table = await this.prisma.roomElement.findUnique({
      where: { id: dto.tableId },
    });

    if (!table || table.type !== "TABLE") {
      throw new BadRequestException("Invalid table ID");
    }

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

  async addItems(orderId: string, dto: AddItemsDto) {
    const order = await this.findOne(orderId);

    if (
      order.status === OrderStatus.PAID ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot modify order with status ${order.status}`,
      );
    }

    // Get menu items and validate
    const menuItemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException("One or more menu items not found");
    }

    const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

    // Create order items
    for (const item of dto.items) {
      const menuItem = menuItemMap.get(item.menuItemId);
      if (!menuItem) continue;

      if (!menuItem.inStock) {
        throw new BadRequestException(
          `Menu item "${menuItem.name}" is out of stock`,
        );
      }

      await this.prisma.orderItem.create({
        data: {
          orderId,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price,
          note: item.note,
          status: OrderItemStatus.PENDING,
        },
      });
    }

    const updatedOrder = await this.recalculateTotal(orderId);
    this.wsGateway.emitOrderUpdated(updatedOrder);
    return updatedOrder;
  }

  async updateItemStatus(
    orderId: string,
    itemId: string,
    status: OrderItemStatus,
  ) {
    const order = await this.findOne(orderId);
    const item = order.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException(`Order item with ID ${itemId} not found`);
    }

    await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
    });

    const updatedOrder = await this.findOne(orderId);

    // Emit appropriate events
    if (status === OrderItemStatus.SENT) {
      this.wsGateway.emitKitchenNew(updatedOrder, item);
    } else if (status === OrderItemStatus.READY) {
      this.wsGateway.emitKitchenReady(updatedOrder, item);
    }

    this.wsGateway.emitItemStatusChanged(updatedOrder, itemId, status);
    return updatedOrder;
  }

  async sendToKitchen(orderId: string) {
    const order = await this.findOne(orderId);

    const pendingItems = order.items.filter(
      (i) => i.status === OrderItemStatus.PENDING && i.menuItem.requiresKitchen,
    );

    if (pendingItems.length === 0) {
      throw new BadRequestException("No pending items to send to kitchen");
    }

    // Update kitchen items to SENT
    await this.prisma.orderItem.updateMany({
      where: {
        id: { in: pendingItems.map((i) => i.id) },
      },
      data: { status: OrderItemStatus.SENT },
    });

    // Update non-kitchen items to READY
    const nonKitchenItems = order.items.filter(
      (i) =>
        i.status === OrderItemStatus.PENDING && !i.menuItem.requiresKitchen,
    );

    if (nonKitchenItems.length > 0) {
      await this.prisma.orderItem.updateMany({
        where: {
          id: { in: nonKitchenItems.map((i) => i.id) },
        },
        data: { status: OrderItemStatus.READY },
      });
    }

    // Update order status
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.SENT },
    });

    const updatedOrder = await this.findOne(orderId);
    this.wsGateway.emitOrderUpdated(updatedOrder);
    this.wsGateway.emitKitchenNew(updatedOrder, null);
    return updatedOrder;
  }

  async markPaid(orderId: string) {
    const order = await this.findOne(orderId);

    const undelivered = order.items.filter(
      (i) => i.status !== OrderItemStatus.DELIVERED,
    );

    if (undelivered.length > 0) {
      throw new BadRequestException(
        "All items must be delivered before marking as paid",
      );
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAID,
        paidAt: new Date(),
      },
    });

    const updatedOrder = await this.findOne(orderId);
    this.wsGateway.emitOrderUpdated(updatedOrder);
    return updatedOrder;
  }

  async cancel(orderId: string) {
    await this.findOne(orderId);

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    const updatedOrder = await this.findOne(orderId);
    this.wsGateway.emitOrderUpdated(updatedOrder);
    return { message: "Order cancelled successfully", order: updatedOrder };
  }

  private async recalculateTotal(orderId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
    });

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await this.prisma.order.update({
      where: { id: orderId },
      data: { total },
    });

    return this.findOne(orderId);
  }
}
