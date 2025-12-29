import { type OrderStatus, type OrderItemStatus } from "@prisma/client";
import type { OrdersService } from "./orders.service";
import type { CreateOrderDto } from "./dto/create-order.dto";
import type { AddItemsDto } from "./dto/add-items.dto";
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    findAll(user: any, status?: OrderStatus): Promise<({
        waiter: {
            id: string;
            name: string;
        };
        room: {
            floor: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                level: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    color: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.MenuItemType;
                description: string | null;
                price: number;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
                quantity: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            quantity: number;
            note: string | null;
            menuItemId: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            orderId: string;
        })[];
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string;
        tableId: string;
        note: string | null;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        paidAt: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        waiter: {
            id: string;
            name: string;
        };
        room: {
            floor: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                level: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    color: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.MenuItemType;
                description: string | null;
                price: number;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
                quantity: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            quantity: number;
            note: string | null;
            menuItemId: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            orderId: string;
        })[];
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string;
        tableId: string;
        note: string | null;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        paidAt: Date | null;
    }>;
    create(dto: CreateOrderDto, user: any): Promise<{
        waiter: {
            id: string;
            name: string;
        };
        room: {
            floor: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                level: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            quantity: number;
            note: string | null;
            menuItemId: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            orderId: string;
        }[];
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string;
        tableId: string;
        note: string | null;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        paidAt: Date | null;
    }>;
    addItems(id: string, dto: AddItemsDto): Promise<{
        waiter: {
            id: string;
            name: string;
        };
        room: {
            floor: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                level: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    color: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.MenuItemType;
                description: string | null;
                price: number;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
                quantity: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            quantity: number;
            note: string | null;
            menuItemId: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            orderId: string;
        })[];
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string;
        tableId: string;
        note: string | null;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        paidAt: Date | null;
    }>;
    updateItemStatus(id: string, itemId: string, status: OrderItemStatus): Promise<{
        waiter: {
            id: string;
            name: string;
        };
        room: {
            floor: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                level: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    color: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.MenuItemType;
                description: string | null;
                price: number;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
                quantity: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            quantity: number;
            note: string | null;
            menuItemId: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            orderId: string;
        })[];
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string;
        tableId: string;
        note: string | null;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        paidAt: Date | null;
    }>;
    sendToKitchen(id: string): Promise<{
        waiter: {
            id: string;
            name: string;
        };
        room: {
            floor: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                level: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    color: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.MenuItemType;
                description: string | null;
                price: number;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
                quantity: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            quantity: number;
            note: string | null;
            menuItemId: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            orderId: string;
        })[];
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string;
        tableId: string;
        note: string | null;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        paidAt: Date | null;
    }>;
    markPaid(id: string): Promise<{
        waiter: {
            id: string;
            name: string;
        };
        room: {
            floor: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                level: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    color: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.MenuItemType;
                description: string | null;
                price: number;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
                quantity: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            quantity: number;
            note: string | null;
            menuItemId: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            orderId: string;
        })[];
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string;
        tableId: string;
        note: string | null;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        paidAt: Date | null;
    }>;
    cancel(id: string): Promise<{
        waiter: {
            id: string;
            name: string;
        };
        room: {
            floor: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                level: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    color: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.MenuItemType;
                description: string | null;
                price: number;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
                quantity: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            quantity: number;
            note: string | null;
            menuItemId: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            orderId: string;
        })[];
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string;
        tableId: string;
        note: string | null;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        paidAt: Date | null;
    }>;
}
