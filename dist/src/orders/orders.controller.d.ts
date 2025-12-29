import { type OrderStatus, type OrderItemStatus } from "@prisma/client";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AddItemsDto } from "./dto/add-items.dto";
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    findAll(user: any, status?: OrderStatus): Promise<({
        room: {
            floor: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        };
        table: {
            id: string;
            roomId: string;
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
        };
        waiter: {
            id: string;
            name: string;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    color: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: import(".prisma/client").$Enums.MenuItemType;
                quantity: number | null;
                price: number;
                description: string | null;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            menuItemId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        id: string;
        roomId: string;
        tableId: string;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidAt: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        room: {
            floor: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        };
        table: {
            id: string;
            roomId: string;
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
        };
        waiter: {
            id: string;
            name: string;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    color: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: import(".prisma/client").$Enums.MenuItemType;
                quantity: number | null;
                price: number;
                description: string | null;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            menuItemId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        id: string;
        roomId: string;
        tableId: string;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidAt: Date | null;
    }>;
    create(dto: CreateOrderDto, user: any): Promise<{
        room: {
            floor: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        };
        table: {
            id: string;
            roomId: string;
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
        };
        waiter: {
            id: string;
            name: string;
        };
        items: {
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            menuItemId: string;
            quantity: number;
            price: number;
        }[];
    } & {
        id: string;
        roomId: string;
        tableId: string;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidAt: Date | null;
    }>;
    addItems(id: string, dto: AddItemsDto): Promise<{
        room: {
            floor: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        };
        table: {
            id: string;
            roomId: string;
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
        };
        waiter: {
            id: string;
            name: string;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    color: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: import(".prisma/client").$Enums.MenuItemType;
                quantity: number | null;
                price: number;
                description: string | null;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            menuItemId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        id: string;
        roomId: string;
        tableId: string;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidAt: Date | null;
    }>;
    updateItemStatus(id: string, itemId: string, status: OrderItemStatus): Promise<{
        room: {
            floor: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        };
        table: {
            id: string;
            roomId: string;
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
        };
        waiter: {
            id: string;
            name: string;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    color: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: import(".prisma/client").$Enums.MenuItemType;
                quantity: number | null;
                price: number;
                description: string | null;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            menuItemId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        id: string;
        roomId: string;
        tableId: string;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidAt: Date | null;
    }>;
    sendToKitchen(id: string): Promise<{
        room: {
            floor: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        };
        table: {
            id: string;
            roomId: string;
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
        };
        waiter: {
            id: string;
            name: string;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    color: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: import(".prisma/client").$Enums.MenuItemType;
                quantity: number | null;
                price: number;
                description: string | null;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            menuItemId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        id: string;
        roomId: string;
        tableId: string;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidAt: Date | null;
    }>;
    markPaid(id: string): Promise<{
        room: {
            floor: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        };
        table: {
            id: string;
            roomId: string;
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
        };
        waiter: {
            id: string;
            name: string;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    color: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: import(".prisma/client").$Enums.MenuItemType;
                quantity: number | null;
                price: number;
                description: string | null;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            menuItemId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        id: string;
        roomId: string;
        tableId: string;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidAt: Date | null;
    }>;
    cancel(id: string): Promise<{
        room: {
            floor: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        };
        table: {
            id: string;
            roomId: string;
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
        };
        waiter: {
            id: string;
            name: string;
        };
        items: ({
            menuItem: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    color: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: import(".prisma/client").$Enums.MenuItemType;
                quantity: number | null;
                price: number;
                description: string | null;
                image: string | null;
                categoryId: string;
                requiresKitchen: boolean;
                inStock: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderItemStatus;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            menuItemId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        id: string;
        roomId: string;
        tableId: string;
        waiterId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
        paidAt: Date | null;
    }>;
}
