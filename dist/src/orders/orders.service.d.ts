import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { AddItemsDto } from "./dto/add-items.dto";
import { OrderStatus, OrderItemStatus, UserRole } from "@prisma/client";
import { WebsocketGateway } from "../websocket/websocket.gateway";
export declare class OrdersService {
    private prisma;
    private wsGateway;
    constructor(prisma: PrismaService, wsGateway: WebsocketGateway);
    findAll(userId: string, userRole: UserRole, status?: OrderStatus): Promise<({
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
    create(dto: CreateOrderDto, waiterId: string): Promise<{
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
    addItems(orderId: string, dto: AddItemsDto): Promise<{
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
    updateItemStatus(orderId: string, itemId: string, status: OrderItemStatus): Promise<{
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
    sendToKitchen(orderId: string): Promise<{
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
    markPaid(orderId: string): Promise<{
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
    cancel(orderId: string): Promise<{
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
    private recalculateTotal;
}
