import { PrismaService } from "../prisma/prisma.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
export declare class MenuService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(categoryId?: string, inStock?: boolean): import(".prisma/client").Prisma.PrismaPromise<({
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
        description: string | null;
        price: number;
        image: string | null;
        type: import(".prisma/client").$Enums.MenuItemType;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
        quantity: number | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
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
        description: string | null;
        price: number;
        image: string | null;
        type: import(".prisma/client").$Enums.MenuItemType;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
        quantity: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateMenuItemDto): import(".prisma/client").Prisma.Prisma__MenuItemClient<{
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
        description: string | null;
        price: number;
        image: string | null;
        type: import(".prisma/client").$Enums.MenuItemType;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
        quantity: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateMenuItemDto): Promise<{
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
        description: string | null;
        price: number;
        image: string | null;
        type: import(".prisma/client").$Enums.MenuItemType;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
        quantity: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
