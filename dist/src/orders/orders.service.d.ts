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
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
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
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
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
    create(dto: CreateOrderDto, waiterId: string): Promise<{
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
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
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
    addItems(orderId: string, dto: AddItemsDto): Promise<{
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
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
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
    updateItemStatus(orderId: string, itemId: string, status: OrderItemStatus): Promise<{
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
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
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
    sendToKitchen(orderId: string): Promise<{
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
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
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
    markPaid(orderId: string): Promise<{
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
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
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
    cancel(orderId: string): Promise<{
        message: string;
        order: {
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
                type: import(".prisma/client").$Enums.ElementType;
                width: number;
                height: number;
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
        };
    }>;
    private recalculateTotal;
}
