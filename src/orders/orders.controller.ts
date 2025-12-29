import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  type OrderStatus,
  type OrderItemStatus,
  UserRole,
} from "@prisma/client";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AddItemsDto } from "./dto/add-items.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@Controller("orders")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll(user: any, @Query("status") status?: OrderStatus) {
    return this.ordersService.findAll(user.id, user.role, status);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.WAITER)
  create(@Body() dto: CreateOrderDto, user: any) {
    return this.ordersService.create(dto, user.id);
  }

  @Patch(":id/items")
  @Roles(UserRole.WAITER)
  addItems(@Param("id") id: string, @Body() dto: AddItemsDto) {
    return this.ordersService.addItems(id, dto);
  }

  @Patch(":id/item/:itemId/status")
  @Roles(UserRole.WAITER, UserRole.CHEF)
  updateItemStatus(
    @Param("id") id: string,
    @Param("itemId") itemId: string,
    @Body("status") status: OrderItemStatus,
  ) {
    return this.ordersService.updateItemStatus(id, itemId, status);
  }

  @Patch(":id/send")
  @Roles(UserRole.WAITER)
  sendToKitchen(@Param("id") id: string) {
    return this.ordersService.sendToKitchen(id);
  }

  @Patch(":id/pay")
  @Roles(UserRole.WAITER)
  markPaid(@Param("id") id: string) {
    return this.ordersService.markPaid(id);
  }

  @Delete(":id")
  @Roles(UserRole.WAITER, UserRole.MANAGER, UserRole.ADMIN)
  cancel(@Param("id") id: string) {
    return this.ordersService.cancel(id);
  }
}
